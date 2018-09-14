import { Injectable } from '@angular/core';

import { Web3Service } from '../../web3.service';
import { SmartContract } from '../smart-contract.abstract';
import { BasicTokenMixin } from './basic-token.mixin';

interface BurnableTokenActions {
  burn: boolean;
}
interface BurnableTokenEvents {
  Burn: {burner: string, value: number};
}
export type BurnableToken = BurnableTokenActions & BurnableTokenEvents;

@Injectable()
export class BurnableTokenMixin extends SmartContract<{}, {}, BurnableTokenActions, BurnableTokenEvents> {
  // Events
  get Burn$() { return this.generateEventObservable('Burn'); }

  // Actions
  get burn() { return (value: number) => this.generateAction('burn')(value); }

  constructor() {
    super(undefined, undefined);
  }
}
