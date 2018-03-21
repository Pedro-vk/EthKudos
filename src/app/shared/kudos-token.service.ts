import { Injectable } from '@angular/core';
import { Tx } from 'web3/types';
import contract from "truffle-contract";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import KudosToken from '../../../build/contracts/KudosToken.json';

import { Contract, TruffleContract, TruffleContractActionMethods, TruffleContractEventMethods } from './truffle.interface';
import { Web3Service, ConnectionStatus } from './web3.service';

interface KudosTokenEvents {
  AddMember: {member: string};
  RemoveMember: {member: string};
  NewPoll: {poll: string};
  ClosePoll: {poll: string};
  OwnershipTransferred: {previousOwner: string, newOwner: string};
}
interface KudosTokenConstants {
  version: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
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
interface KudosTokenActions {
  newPoll: boolean;
  closePoll: boolean;
  addMember: boolean;
  removeMember: boolean;
  editContact: boolean;
  transfer: boolean;
}
export type KudosToken = KudosTokenActions & KudosTokenConstants & KudosTokenEvents;
export type KudosTokenContract = TruffleContract<KudosTokenConstants, KudosTokenActions, KudosTokenEvents>;

@Injectable()
export class KudosTokenService {
  private contract: KudosTokenContract;

  // Events
  readonly AddMember$ = this.generateEventObservable('AddMember');
  readonly RemoveMember$ = this.generateEventObservable('RemoveMember');
  readonly NewPoll$ = this.generateEventObservable('NewPoll');
  readonly ClosePoll$ = this.generateEventObservable('ClosePoll');
  readonly OwnershipTransferred$ = this.generateEventObservable('OwnershipTransferred');

  constructor(private web3Service: Web3Service) {
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
        const kudosToken = <Contract<KudosTokenContract>>contract(KudosToken);
        kudosToken.setProvider(this.web3Service.web3.currentProvider);
        kudosToken.deployed()
          .then(contract => this.contract = contract);
      });
  }

  // Constants
  version(): Promise<KudosToken['version']> {
    return this.contract.version();
  }
  name(): Promise<KudosToken['name']> {
    return this.contract.name();
  }
  symbol(): Promise<KudosToken['symbol']> {
    return this.contract.symbol();
  }
  decimals(): Promise<KudosToken['decimals']> {
    return this.contract.decimals();
  }
  totalSupply(): Promise<KudosToken['totalSupply']> {
    return this.contract.totalSupply();
  }

  owner(): Promise<KudosToken['owner']> {
    return this.contract.owner();
  }

  activePoll(): Promise<KudosToken['activePoll']> {
    return this.contract.activePoll();
  }
  getPolls(): Promise<KudosToken['getPolls']> {
    return this.contract.getPolls();
  }
  getPollsSize(): Promise<KudosToken['getPollsSize']> {
    return this.contract.getPollsSize();
  }

  isMember(address: string): Promise<KudosToken['isMember']> {
    return this.contract.isMember(address);
  }
  memberIndex(address: string): Promise<KudosToken['memberIndex']> {
    return this.contract.memberIndex(address);
  }
  getMembers(): Promise<KudosToken['getMembers']> {
    return this.contract.getMembers();
  }
  getMember(index: number): Promise<KudosToken['getMember']> {
    return this.contract.getMember(index);
  }
  membersNumber(): Promise<KudosToken['membersNumber']> {
    return this.contract.membersNumber();
  }

  getContact(address: string): Promise<KudosToken['getContact']> {
    return this.contract.getContact(address);
  }

  balanceOf(address: string): Promise<KudosToken['balanceOf']> {
    return this.contract.balanceOf(address);
  }

  // Actions
  newPoll(kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number): Promise<Tx> {
    return this.generateAction('newPoll')(kudosByMember, maxKudosToMember, minDurationInMinutes);
  }
  closePoll(): Promise<Tx> {
    return this.generateAction('closePoll')();
  }

  addMember(member: string, name: string): Promise<Tx> {
    return this.generateAction('addMember')(member, name);
  }
  removeMember(address: string): Promise<Tx> {
    return this.generateAction('removeMember')(address);
  }

  editContact(address: string, name: string): Promise<Tx> {
    return this.generateAction('editContact')(address, name);
  }

  transfer(to: string, value: number): Promise<Tx> {
    return this.generateAction('transfer')(to, value);
  }

  // Helpers
  private generateAction<P extends keyof TruffleContractActionMethods<KudosTokenActions>>(action: P): (...args) => Promise<Tx> {
    return (...args) => (<any>this.contract)[action](...args, {from: this.web3Service.account});
  }
  private generateEventObservable<P extends keyof TruffleContractEventMethods<KudosTokenEvents>>(event: P): Observable<KudosTokenEvents[P]> {
    return Observable
      .create(observer => (<any>this.contract)[event]().watch((e, _) => observer.next(_.args)))
      .share();
  }

}
