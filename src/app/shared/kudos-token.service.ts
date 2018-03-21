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


}
