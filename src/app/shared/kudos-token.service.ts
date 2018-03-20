import { Injectable } from '@angular/core';
import contract from "truffle-contract";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import KudosToken from '../../../build/contracts/KudosToken.json';

import { Contract, TruffleContract } from './truffle.interface';
import { Web3Service, ConnectionStatus } from './web3.service';

interface KudosTokenActions {
  newPoll: boolean;
  closePoll: boolean;
  addMember: boolean;
  removeMember: boolean;
  editContact: boolean;
  transfer: boolean;
}
interface KudosTokenConstants {
  version: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
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
export type KudosToken = KudosTokenActions & KudosTokenConstants;
export type KudosTokenContract = TruffleContract<KudosTokenConstants, KudosTokenActions>;

@Injectable()
export class KudosTokenService {
  private contract: KudosTokenContract;

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
        console.log(this);
      });
  }

  get version(): Promise<KudosToken['version']> {
    return this.contract.version();
  }
  get name(): Promise<KudosToken['name']> {
    return this.contract.name();
  }
  get symbol(): Promise<KudosToken['symbol']> {
    return this.contract.symbol();
  }
  get decimals(): Promise<KudosToken['decimals']> {
    return this.contract.decimals();
  }
  get totalSupply(): Promise<KudosToken['totalSupply']> {
    return this.contract.totalSupply();
  }

  // newPoll
  // closePoll
  // activePoll
  // getPolls
  // getPollsSize
  // addMember
  // removeMember
  // isMember
  // memberIndex
  // getMembers
  // getMember
  // membersNumber
  // editContact
  // getContact
  // transfer
  // balanceOf

}
