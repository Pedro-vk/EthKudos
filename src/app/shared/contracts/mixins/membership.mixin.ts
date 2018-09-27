import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Web3Service } from '../../web3.service';
import { SmartContract } from '../smart-contract.abstract';

interface MembershipConstants {
  isMember: boolean;
  memberIndex?: number;
  getMembers: string[];
  getMember: string;
  membersNumber: number;
}
interface MembershipActions {
  addMember: boolean;
  addMembers?: boolean;
  removeMember?: boolean;
}
interface MembershipEvents {
  AddMember: {member: string};
  RemoveMember?: {member: string};
}
export type Membership = MembershipActions & MembershipConstants & MembershipEvents;

@Injectable()
export class MembershipMixin extends SmartContract<MembershipConstants, {}, MembershipActions, MembershipEvents> {
  // Events
  get AddMember$() { return this.generateEventObservable('AddMember'); }
  get RemoveMember$() { return this.generateEventObservable('RemoveMember'); }

  // Constants
  get isMember() { return (address: string) => this.generateConstant('isMember')(address); }
  get memberIndex() { return (address: string) => this.generateConstant('memberIndex', this.n)(address); }
  get getMembers() { return () => this.generateConstant('getMembers')(); }
  get getMember() { return (index: number) => this.generateConstant('getMember')(index); }
  get membersNumber() { return () => this.generateConstant('membersNumber', this.n)(); }

  // Actions
  get addMember() { return (member: string, name: string) => this.generateAction('addMember')(member, name); }
  get addMembers() { return (members: string[]) => this.generateAction('addMembers')(members); }
  get removeMember() { return (address: string) => this.generateAction('removeMember')(address); }

  constructor(protected web3Service: Web3Service) {
    super(web3Service, undefined);
  }

  // Helpers
  async imMember(): Promise<boolean> {
    const account = await this.web3Service.getAccount().toPromise();
    return await this.isMember(account);
  }
}
