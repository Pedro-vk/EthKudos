import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/share';

import { Web3Service } from '../../web3.service';
import { SmartContract, emptyPromise } from '../smart-contract.abstract';

interface BasicTokenConstants {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  balanceOf: number;
}
interface BasicTokenActions {
  transfer: boolean;
}
interface BasicTokenEvents {
  Transfer: {from: string, to: string, value: number};
}
export type BasicToken = BasicTokenActions & BasicTokenConstants & BasicTokenEvents;

@Injectable()
export class BasicTokenMixin extends SmartContract<BasicTokenConstants, {}, BasicTokenActions, BasicTokenEvents> {
  // Events
  get Transfer$() { return this.generateEventObservable('Transfer'); }

  // Constants
  get name() { return () => this.generateConstant('name')(); }
  get symbol() { return () => this.generateConstant('symbol')(); }
  get decimals() { return () => this.generateConstant('decimals')(); }
  get totalSupply() { return () => this.generateConstant('totalSupply')(); }
  get balanceOf() { return (address: string) => this.generateConstant('balanceOf')(address); }

  // Actions
  get transfer() { return (to: string, value: number) => this.generateAction('transfer')(to, value); }

  constructor(protected web3Service: Web3Service) {
    super(web3Service, undefined);
  }

  // Helpers
  getTokenInfo(): Observable<{name?: string, symbol?: string, decimals?: number}> {
    return this
      .checkUpdates(async contract => ({
        name: await ((<any>contract).name || emptyPromise)(),
        symbol: await ((<any>contract).symbol || emptyPromise)(),
        decimals: await ((<any>contract).decimals || emptyPromise)(),
      }))
      .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      .share();
  }

  async myBalance(): Promise<number> {
    const account = await this.web3Service.getAccount().toPromise();
    return await this.balanceOf(account);
  }
}
