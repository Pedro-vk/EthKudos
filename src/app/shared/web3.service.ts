import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import contract from "truffle-contract";

import Migrations from '../../../build/contracts/Migrations.json';

export type connectionStatus = 'total' | 'no-account' | 'no-provider' | 'no-network';

@Injectable()
export class Web3Service {
  private _web3: Web3;
  private existInNetwork: boolean;

  private readonly interval$: Observable<any> = Observable
    .interval(100)
    .startWith(undefined)
    .share();
  readonly newBlock$: Observable<number> = this.interval$
    .mergeMap(() => this.getBlockNumber())
    .distinctUntilChanged()
    .share();
  readonly newAccount$: Observable<string> = this.interval$
    .mergeMap(() => this.getAccount())
    .distinctUntilChanged()
    .share();
  readonly changes$: Observable<undefined> = Observable
    .merge(this.newBlock$, this.newAccount$)
    .map(() => undefined)
    .share();
  readonly status$: Observable<connectionStatus> = this.interval$
    .mergeMap(() => this.getAccount())
    .map((account): connectionStatus => {
      if (!this.web3) {
        return "no-provider";
      }
      if (!account) {
        return "no-account";
      }
      if (!this.existInNetwork) {
        return 'no-network';
      }
      return 'total';
    })
    .distinctUntilChanged();

  get web3(): Web3 {
    return this._web3 || this.initWeb3();
  }

  constructor() {
    this.checkContractInNetwork();
  }

  private initWeb3(): Web3 {
    if ((<any>window).web3) {
      return this._web3 = new Web3((<any>window).web3.currentProvider);
    }
  }

  private checkContractInNetwork(): void {
    if (this.web3) {
      const migrations = contract(Migrations);
      migrations.setProvider(this.web3.currentProvider);
      migrations
        .deployed()
        .then(() => this.existInNetwork = true)
        .catch(() => this.existInNetwork = false);
    }
  }

  getAccount(): Observable<string> {
    if (!this.web3) {
      return Observable.of(undefined);
    }
    return Observable
      .fromPromise(this.web3.eth.getAccounts())
      .map(accounts => accounts[0] || undefined);
  }

  getEthBalance(): Observable<number> {
    if (!this.web3) {
      return Observable.of(undefined);
    }
    return this.getAccount()
      .mergeMap(account => Observable.fromPromise(this.web3.eth.getBalance(account)))
      .map(balance => +this.web3.utils.fromWei(balance, 'ether'))
      .catch(() => Observable.of(undefined));
  }

  getBlockNumber(): Observable<number> {
    if (this.web3) {
      return Observable.fromPromise(this.web3.eth.getBlockNumber());
    }
    return Observable.empty();
  }

  checkUpdates<T>(checkObservable: (Web3Service) => Observable<T>): Observable<T> {
    return this.changes$
      .mergeMap(() => checkObservable(this))
      .distinctUntilChanged();
  }
}
