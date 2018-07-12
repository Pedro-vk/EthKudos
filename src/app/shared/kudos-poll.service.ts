import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import * as KudosPollDefinition from '../../../build/contracts/KudosPoll.json';

import { SmartContract } from './smart-contract.abstract';
import { Web3Service, ConnectionStatus } from './web3.service';

export interface Gratitude {
  kudos: number;
  message: string;
  from: string;
}

export interface Result {
  kudos: number;
  member: string;
}

interface KudosPollConstants {
  version: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  active: boolean;
  kudosByMember: number;
  maxKudosToMember: number;
  members: string[];
  minDeadline: number;
  creation: number;
  canBeClosed: boolean;
  isMember: boolean;
  getMembers: string[];
  getMember: string;
  membersNumber: number;
  balanceOf: number;
  getGratitudeOf: Gratitude;
  getGratitudesSizeOf: number;
  getKudosOf: number;
  getPollResult: Result;
  getPollResultsSize: number;
}
type KudosPollConstantsIteratiors = { // tslint:disable-line
  getGratitudesOf: Gratitude[];
  getPollResults: Result[];
};
interface KudosPollActions {
  close: boolean;
  addMember: boolean;
  addMembers: boolean;
  transfer: boolean;
  burn: undefined;
  reward: boolean;
}
interface KudosPollEvents {
  AddMember: {member: string};
  Close: {};
  OwnershipTransferred: {previousOwner: string, newOwner: string};
  Reward: {sender: string, rewarded: string, kudos: number, message: string};
  Transfer: {from: string, to: string, value: number};
}
export type KudosPoll = KudosPollActions & KudosPollConstantsIteratiors & KudosPollConstants & KudosPollEvents;

Web3Service.addABI(KudosPollDefinition.abi);

@Injectable()
export class KudosPollService extends SmartContract<KudosPollConstants, KudosPollConstantsIteratiors, KudosPollActions, KudosPollEvents> {

  // Events
  readonly AddMember$ = this.generateEventObservable('AddMember');
  readonly Close$ = this.generateEventObservable('Close');
  readonly OwnershipTransferred$ = this.generateEventObservable('OwnershipTransferred');
  readonly Reward$ = this.generateEventObservable('Reward');
  readonly Transfer$ = this.generateEventObservable('Transfer');

  // Constants
  readonly version = () => this.generateConstant('version')();
  readonly name = () => this.generateConstant('name')();
  readonly symbol = () => this.generateConstant('symbol')();
  readonly decimals = () => this.generateConstant('decimals')();
  readonly totalSupply = () => this.generateConstant('totalSupply')();
  readonly active = () => this.generateConstant('active')();
  readonly kudosByMember = () => this.generateConstant('kudosByMember')();
  readonly maxKudosToMember = () => this.generateConstant('maxKudosToMember')();
  readonly members = () => this.generateConstant('members')();
  readonly minDeadline = () => this.generateConstant('minDeadline')();
  readonly creation = () => this.generateConstant('creation')();
  readonly canBeClosed = () => this.generateConstant('canBeClosed')();
  readonly isMember = (member: string) => this.generateConstant('isMember')(member);
  readonly getMembers = () => this.generateConstant('getMembers')();
  readonly getMember = (index: number) => this.generateConstant('getMember')(index);
  readonly membersNumber = () => this.generateConstant('membersNumber')();
  readonly balanceOf = (owner: string) => this.generateConstant('balanceOf')(owner);
  readonly getGratitudeOf = (member: string, index: number) =>
    this.generateConstant('getGratitudeOf', ([kudos, message, from]) => ({kudos, message, from}))(member, index)
  readonly getGratitudesSizeOf = (member: string) => this.generateConstant('getGratitudesSizeOf')(member);
  readonly getKudosOf = (member: string) => this.generateConstant('getKudosOf')(member);
  readonly getPollResult = (index: number) => this.generateConstant('getPollResult', ([member, kudos]) => ({member, kudos}))(index);
  readonly getPollResultsSize = () => this.generateConstant('getPollResultsSize')();

  // Constant iterators
  readonly getGratitudesOf = (member: string) =>
    this.generateConstantIteration<'getGratitudesOf'>(() => this.getGratitudesSizeOf(member), i => this.getGratitudeOf(member, i))
  readonly getPollResults = () =>
    this.generateConstantIteration<'getPollResults'>(() => this.getPollResultsSize(), i => this.getPollResult(i))

  // Actions
  readonly close = () => this.generateAction('close')();
  readonly addMember = (member: string) => this.generateAction('addMember')(member);
  readonly addMembers = (members: string[]) => this.generateAction('addMembers')(members);
  readonly transfer = (to: string, value: number) => this.generateAction('transfer')(to, value);
  readonly reward = (to: string, kudos: number, message: string) => this.generateAction('reward')(to, kudos, message);

  constructor(protected web3Service: Web3Service) {
    super(web3Service);
  }

  initAt(address: string): void {
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
        this.web3Contract = this.getWeb3Contract(KudosPollDefinition.abi, address);

        const kudosPoll = this.getContract(KudosPollDefinition);

        kudosPoll.at(address)
          .then(contract => {
            this.contract = contract;
            this.initialized = true;
          });
      });
  }

  async fromDecimals(value: number): Promise<number> {
    const decimals = await this.decimals();
    return value * (10 ** decimals);
  }

  async fromInt(value: number): Promise<number> {
    const decimals = await this.decimals();
    return value / (10 ** decimals);
  }

  async remainingKudos(): Promise<number> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.balanceOf(myAccount);
  }

  async myKudos(): Promise<number> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.getKudosOf(myAccount);
  }

  async imMember(): Promise<boolean> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.isMember(myAccount);
  }

  async myGratitudes(): Promise<Gratitude[]> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.getGratitudesOf(myAccount);
  }

  async allGratitudes(): Promise<(Gratitude & {to: string})[]> {
    const members = await this.getMembers();
    const gratidudesByMember = (members || [])
      .map(async member =>
        (await this.getGratitudesOf(member))
          .map(gratitude => ({...gratitude, to: member})),
      );
    const allGratitudes = (await Promise.all(gratidudesByMember))
      .reduce((acc, _) => [...acc, ..._], []);
    return allGratitudes;
  }

  async gratitudesNumberByMember(): Promise<{received: {[to: string]: number}, sent: {[from: string]: number}}> {
    const members = await this.getMembers();
    const initial = (members || []).reduce((acc, _) => ({...acc, [_]: 0}), {});
    const allGratitudes = (await this.allGratitudes())
      .reduce(({received, sent}, {from, to}) => ({
        received: {
          ...received,
          [to.toLowerCase()]: (received[to.toLowerCase()] || 0) + 1,
        },
        sent: {
          ...sent,
          [from.toLowerCase()]: (sent[from.toLowerCase()] || 0) + 1,
        },
      }), {received: {...initial}, sent: {...initial}});
    return allGratitudes;
  }

  async myGratitudesSent(): Promise<(Gratitude & {to: string})[]> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return (await this.allGratitudes())
      .filter(gratitude => gratitude.from.toLowerCase() === myAccount.toLowerCase());
  }
}
