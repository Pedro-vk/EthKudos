import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';

export type connectionStatus = 'total' | 'no-account' | 'no-provider' | 'no-network' | 'no-ether';

@Injectable()
export class Web3Service {
  private _web3: Web3;

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
  readonly changes$: Observable<any> = Observable
    .merge(this.newBlock$, this.newAccount$)
    .map(() => undefined);

  get web3(): Web3 {
    return this._web3 || this.initWeb3();
  }

  private initWeb3(): Web3 {
    if ((<any>window).web3) {
      return this._web3 = new Web3((<any>window).web3.currentProvider);
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
      .map(balance => +this.web3.utils.fromWei(balance, 'ether'));
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
