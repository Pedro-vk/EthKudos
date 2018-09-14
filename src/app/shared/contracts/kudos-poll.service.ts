import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import * as KudosPollDefinition from '../../../../build/contracts/KudosPoll.json';

import { SmartContract } from './smart-contract.abstract';
import { Web3Service, ConnectionStatus } from '../web3.service';
import { SmartContractExtender, OwnableMixin, BasicTokenMixin, BurnableTokenMixin, MembershipMixin } from './mixins';

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
  active: boolean;
  kudosByMember: number;
  maxKudosToMember: number;
  members: string[];
  minDeadline: number;
  creation: number;
  canBeClosed: boolean;
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
  reward: boolean;
}
interface KudosPollEvents {
  Close: {};
  Reward: {sender: string, rewarded: string, kudos: number, message: string};
}
export type KudosPoll = KudosPollActions & KudosPollConstantsIteratiors & KudosPollConstants & KudosPollEvents;

Web3Service.addABI(KudosPollDefinition.abi);

class KudosPollSmartContract
  extends SmartContract<KudosPollConstants, KudosPollConstantsIteratiors, KudosPollActions, KudosPollEvents> { }

@Injectable()
export class KudosPollService
  extends SmartContractExtender(KudosPollSmartContract, OwnableMixin, BasicTokenMixin, BurnableTokenMixin, MembershipMixin) {

  // Events
  readonly Close$ = this.generateEventObservable('Close');
  readonly Reward$ = this.generateEventObservable('Reward');

  // Constants
  readonly version = () => this.generateConstant('version')();
  readonly active = () => this.generateConstant('active')();
  readonly kudosByMember = () => this.generateConstant('kudosByMember')();
  readonly maxKudosToMember = () => this.generateConstant('maxKudosToMember')();
  readonly members = () => this.generateConstant('members')();
  readonly minDeadline = () => this.generateConstant('minDeadline')();
  readonly creation = () => this.generateConstant('creation')();
  readonly canBeClosed = () => this.generateConstant('canBeClosed')();
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
  readonly reward = (to: string, kudos: number, message: string) => this.generateAction('reward')(to, kudos, message);

  constructor(protected web3Service: Web3Service, protected store: Store<any>) {
    super(web3Service, store);
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
            this.contract = <any>contract;
            this.initialized = true;
          });
      });
  }

  async remainingKudos(): Promise<number> {
    return await this.balanceOf(await this.web3Service.getAccount().toPromise());
  }

  async myKudos(): Promise<number> {
    return await this.getKudosOf(await this.web3Service.getAccount().toPromise());
  }

  async myGratitudes(): Promise<Gratitude[]> {
    return await this.getGratitudesOf(await this.web3Service.getAccount().toPromise());
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
