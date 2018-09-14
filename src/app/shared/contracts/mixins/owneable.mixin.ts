import { Injectable } from '@angular/core';

import { Web3Service } from '../../web3.service';
import { SmartContract } from '../smart-contract.abstract';

interface OwnableConstants {
  owner: string;
}
interface OwnableActions {
  transferOwnership: void;
}
interface OwnableEvents {
  OwnershipTransferred: {previousOwner: string, newOwner: string};
}
export type Ownable = OwnableActions & OwnableConstants & OwnableEvents;

@Injectable()
export class OwnableMixin extends SmartContract<OwnableConstants, {}, OwnableActions, OwnableEvents> {
  // Events
  get OwnershipTransferred$() { return this.generateEventObservable('OwnershipTransferred'); }

  // Constants
  get owner() { return () => this.generateConstant('owner')(); }

  // Actions
  get transferOwnership() { return (newOwner: string) => this.generateAction('transferOwnership')(newOwner); }

  constructor(protected web3Service: Web3Service) {
    super(web3Service, undefined);
  }

  // Helpers
  async isOwner(account: string): Promise<boolean> {
    const owner = await this.owner();
    return owner.toLowerCase() === account.toLowerCase();
  }
  async imOwner(): Promise<boolean> {
    return this.isOwner(await this.web3Service.getAccount().toPromise());
  }
}
