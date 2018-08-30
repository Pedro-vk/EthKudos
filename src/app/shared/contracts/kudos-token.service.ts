import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/toPromise';

import * as KudosTokenDefinition from '../../../../build/contracts/KudosToken.json';

import { SmartContract } from './smart-contract.abstract';
import { Contract, TruffleContract, TruffleContractActionMethods, TruffleContractEventMethods } from './truffle.interface';
import { Web3Service, ConnectionStatus } from '../web3.service';
import { KudosPollFactoryService } from '../kudos-poll-factory.service';
import { KudosPollService } from './kudos-poll.service';

interface KudosTokenConstants {
  version: string;
  organisationName: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  isActivePoll: boolean;
  owner: string;
  activePoll: string;
  getPolls: string[];
  getPollsSize: number;
  isMember: boolean;
  memberIndex: number;
  getMembers: string[];
  getMember: string;
  membersNumber: number;
  getContact: string;
  balanceOf: number;
}
type KudosTokenConstantsIteratiors = {  // tslint:disable-line
  getBalances: {member: string, balance: number, name: string}[];
};
interface KudosTokenActions {
  newPoll: boolean;
  closePoll: boolean;
  addMember: boolean;
  removeMember: boolean;
  editContact: boolean;
  transfer: boolean;
}
interface KudosTokenEvents {
  AddMember: {member: string};
  RemoveMember: {member: string};
  NewPoll: {poll: string};
  ClosePoll: {poll: string};
  OwnershipTransferred: {previousOwner: string, newOwner: string};
  Transfer: {from: string, to: string, value: number};
}
export type KudosToken = KudosTokenActions & KudosTokenConstantsIteratiors & KudosTokenConstants & KudosTokenEvents;

Web3Service.addABI(KudosTokenDefinition.abi);

@Injectable()
export class KudosTokenService
  extends SmartContract<KudosTokenConstants, KudosTokenConstantsIteratiors, KudosTokenActions, KudosTokenEvents> {

  isValid: boolean;
  private readonly _onIsValid = new Subject<boolean>();
  readonly onIsValid = this._onIsValid.shareReplay();

  // Events
  readonly AddMember$ = this.generateEventObservable('AddMember');
  readonly RemoveMember$ = this.generateEventObservable('RemoveMember');
  readonly NewPoll$ = this.generateEventObservable('NewPoll');
  readonly ClosePoll$ = this.generateEventObservable('ClosePoll');
  readonly OwnershipTransferred$ = this.generateEventObservable('OwnershipTransferred');
  readonly Transfer$ = this.generateEventObservable('Transfer');

  // Constants
  readonly version = () => this.generateConstant('version')();
  readonly organisationName = () => this.generateConstant('organisationName')();
  readonly name = () => this.generateConstant('name')();
  readonly symbol = () => this.generateConstant('symbol')();
  readonly decimals = () => this.generateConstant('decimals')();
  readonly totalSupply = () => this.generateConstant('totalSupply')();
  readonly isActivePoll = () => this.generateConstant('isActivePoll')();
  readonly owner = () => this.generateConstant('owner')();
  readonly activePoll = () => this.generateConstant('activePoll')();
  readonly getPolls = () => this.generateConstant('getPolls')();
  readonly getPollsSize = () => this.generateConstant('getPollsSize')();
  readonly isMember = (address: string) => this.generateConstant('isMember')(address);
  readonly memberIndex = (address: string) => this.generateConstant('memberIndex')(address);
  readonly getMembers = () => this.generateConstant('getMembers')();
  readonly getMember = (index: number) => this.generateConstant('getMember')(index);
  readonly membersNumber = () => this.generateConstant('membersNumber')();
  readonly getContact = (address: string) => this.generateConstant('getContact')(address);
  readonly balanceOf = (address: string) => this.generateConstant('balanceOf')(address);

  // Constant iterators
  readonly getBalances = () => this.generateConstantIteration<'getBalances'>(
    () => this.membersNumber(),
    async i => {
      const member = await this.getMember(i);
      const name = await this.getContact(member);
      return {member, name, balance: await this.balanceOf(member)};
    },
  )

  // Actions
  readonly newPoll = (kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number) =>
    this.generateAction('newPoll')(kudosByMember, maxKudosToMember, minDurationInMinutes)
  readonly closePoll = () => this.generateAction('closePoll')();
  readonly addMember = (member: string, name: string) => this.generateAction('addMember')(member, name);
  readonly removeMember = (address: string) => this.generateAction('removeMember')(address);
  readonly editContact = (address: string, name: string) => this.generateAction('editContact')(address, name);
  readonly transfer = (to: string, value: number) => this.generateAction('transfer')(to, value);

  constructor(protected web3Service: Web3Service, private kudosPollFactoryService: KudosPollFactoryService) {
    super(web3Service);
  }

  initAt(address: string): void {
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
        if (!this.web3Service.web3.utils.isAddress(address)) {
          this._onIsValid.next(this.isValid = false);
          return;
        }

        this.web3Contract = this.getWeb3Contract(KudosTokenDefinition.abi, address);

        const kudosToken = this.getContract(KudosTokenDefinition);
        kudosToken.at(address)
          .then(contract => {
            this.contract = contract;
            this.initialized = true;
          })
          .catch(() => this._onIsValid.next(this.isValid = false));

        this.checkIsValid()
          .then(_ => this._onIsValid.next(this.isValid = _))
          .catch(() => this._onIsValid.next(this.isValid = false));

        setTimeout(() => this._onIsValid.next(this.isValid = this.isValid || false), 20 * 1000);
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

  async getContactsOf(members: string[]): Promise<{member: string, name: string}[]> {
    const contacts = members.map(async member => ({member, name: await this.getContact(member)}));
    return await Promise.all(contacts);
  }

  async getContacts(): Promise<{member: string, name: string}[]> {
    const members = await this.getMembers();
    const contacts = members.map(async member => ({member, name: await this.getContact(member)}));
    return await Promise.all(contacts);
  }

  async myBalance(): Promise<number> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.balanceOf(myAccount);
  }

  async myContact(): Promise<string> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.getContact(myAccount);
  }

  async imOwner(): Promise<boolean> {
    const owner = await this.owner();
    const i = await this.web3Service.getAccount().toPromise();
    return owner.toLowerCase() === i.toLowerCase();
  }

  async imMember(): Promise<boolean> {
    const myAccount = await this.web3Service.getAccount().toPromise();
    return await this.isMember(myAccount);
  }

  getPollContractByAddress(address: string): KudosPollService {
    return this.kudosPollFactoryService.getKudosPollServiceAt(address);
  }
  async getPollContract(index: number): Promise<KudosPollService> {
    const polls = await this.getPolls();
    return this.getPollContractByAddress(polls[index]);
  }
  async getPollsContracts(): Promise<KudosPollService[]> {
    const polls = await this.getPolls();
    return polls.map(address => this.getPollContractByAddress(address));
  }
  async getActivePollContract(): Promise<KudosPollService> {
    const activePoll = await this.activePoll();
    return activePoll ? this.getPollContractByAddress(activePoll) : undefined;
  }
  async getPreviousPollsContracts(): Promise<KudosPollService[]> {
    const polls = await this.getPolls();
    if (await this.isActivePoll()) {
      polls.pop();
    }
    return polls.map(address => this.getPollContractByAddress(address));
  }
  async getPreviousPolls(): Promise<string[]> {
    const polls = await this.getPolls();
    if (await this.isActivePoll()) {
      polls.pop();
    }
    return polls;
  }

  private checkIsValid(): Promise<boolean> {
    return this.onInitialized
      .map(async () => {
        try {
          switch (false) {
            case this.initialized: return false;
            case !!(await this.version()).match(/^\d+\.\d+$/): return false;
            // Decreased number of check to speed up the validation
            // case !!(await this.name()): return false;
            // case !!(await this.symbol()): return false;
            // case !isNaN(await this.decimals()): return false;
            case !isNaN(await this.getPollsSize()): return false;
            default: return true;
          }
        } catch (e) {
          return false;
        }
      })
      .mergeMap(_ => Observable.fromPromise(_))
      .first()
      .toPromise();
  }
}
