import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import KudosTokenDefinition from '../../../build/contracts/KudosToken.json';

import { SmartContract } from './smart-contract.abstract';
import { Contract, TruffleContract, TruffleContractActionMethods, TruffleContractEventMethods } from './truffle.interface';
import { Web3Service, ConnectionStatus } from './web3.service';

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
interface KudosTokenEvents {
  AddMember: {member: string};
  RemoveMember: {member: string};
  NewPoll: {poll: string};
  ClosePoll: {poll: string};
  OwnershipTransferred: {previousOwner: string, newOwner: string};
  Transfer: {from: string, to: string, value: number};
}
export type KudosToken = KudosTokenActions & KudosTokenConstants & KudosTokenEvents;

@Injectable()
export class KudosTokenService extends SmartContract<KudosTokenConstants, undefined, KudosTokenActions, KudosTokenEvents> {

  // Constants
  readonly version = () => this.generateConstant('version')();
  readonly name = () => this.generateConstant('name')();
  readonly symbol = () => this.generateConstant('symbol')();
  readonly decimals = () => this.generateConstant('decimals')();
  readonly totalSupply = () => this.generateConstant('totalSupply')();
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

  // Actions
  readonly newPoll = (kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number) => this.generateAction('newPoll')(kudosByMember, maxKudosToMember, minDurationInMinutes);
  readonly closePoll = () => this.generateAction('closePoll')();
  readonly addMember = (member: string, name: string) => this.generateAction('addMember')(member, name);
  readonly removeMember = (address: string) => this.generateAction('removeMember')(address);
  readonly editContact = (address: string, name: string) => this.generateAction('editContact')(address, name);
  readonly transfer = (to: string, value: number) => this.generateAction('transfer')(to, value);

  // Events
  readonly AddMember$ = this.generateEventObservable('AddMember');
  readonly RemoveMember$ = this.generateEventObservable('RemoveMember');
  readonly NewPoll$ = this.generateEventObservable('NewPoll');
  readonly ClosePoll$ = this.generateEventObservable('ClosePoll');
  readonly OwnershipTransferred$ = this.generateEventObservable('OwnershipTransferred');
  readonly Transfer$ = this.generateEventObservable('Transfer');

  constructor(protected web3Service: Web3Service) {
    super(web3Service);
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
        const kudosToken = this.getContract(KudosTokenDefinition);
        kudosToken.deployed()
          .then(contract => this.contract = contract);
      });
  }
}
