import { Injectable } from '@angular/core';

import KudosPollDefinition from '../../../build/contracts/KudosPoll.json';

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
type KudosPollConstantsIteratiors = {
  getGratitudesOf: Gratitude[];
  getPollResults: Result[];
}
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

@Injectable()
export class KudosPollService extends SmartContract<KudosPollConstants, KudosPollConstantsIteratiors, KudosPollActions, KudosPollEvents> {

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
  readonly getGratitudeOf = (member: string, index: number) => this.generateConstant('getGratitudeOf', ([kudos, message, from]) => ({kudos, message, from}))(member, index);
  readonly getGratitudesSizeOf = (member: string) => this.generateConstant('getGratitudesSizeOf')(member);
  readonly getKudosOf = (member: string) => this.generateConstant('getKudosOf')(member);
  readonly getPollResult = (index: number) => this.generateConstant('getPollResult', ([member, kudos]) => ({member, kudos}))(index);
  readonly getPollResultsSize = () => this.generateConstant('getPollResultsSize')();

  // Constant iterators
  readonly getGratitudesOf = (member: string) => this.generateConstantIteration<'getGratitudesOf'>(() => this.getGratitudesSizeOf(member), i => this.getGratitudeOf(member, i));
  readonly getPollResults = () => this.generateConstantIteration<'getPollResults'>(() => this.getPollResultsSize(), i => this.getPollResult(i));

  // Actions
  readonly close = () => this.generateAction('close')();
  readonly addMember = (member: string) => this.generateAction('addMember')(member);
  readonly addMembers = (members: string[]) => this.generateAction('addMembers')(members);
  readonly transfer = (to: string, value: number) => this.generateAction('transfer')(to, value);
  readonly burn = (value: number) => this.generateAction('burn')(value);
  readonly reward = (to: string, kudos: number, message: string) => this.generateAction('reward')(to, kudos, message);

  // Events
  readonly AddMember$ = this.generateEventObservable('AddMember');
  readonly Close$ = this.generateEventObservable('Close');
  readonly OwnershipTransferred$ = this.generateEventObservable('OwnershipTransferred');
  readonly Reward$ = this.generateEventObservable('Reward');
  readonly Transfer$ = this.generateEventObservable('Transfer');

  constructor(protected web3Service: Web3Service) {
    super(web3Service);
  }

  initAt(address: string): void {
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
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
}
