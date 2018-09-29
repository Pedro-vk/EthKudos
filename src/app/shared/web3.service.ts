import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import Web3 from 'web3';
import * as Web3Module from 'web3';
import { Transaction, ABIDataTypes, Block, BlockType } from 'web3/types';
import * as abiDecoder from 'abi-decoder';
import * as contract from 'truffle-contract';
import { detect } from 'detect-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/race';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

import * as Migrations from '../../../build/contracts/Migrations.json';

export enum ConnectionStatus {
  Total = 'total',
  NoAccount = 'no-account',
  NoProvider = 'no-provider',
  NoNetwork = 'no-network',
  Timeout = 'timeout',
}

export interface FullTransaction extends Transaction {
  method: string;
  methodName: string;
  confirmations?: number;
  params: {
    name: string;
    value: string;
    type: ABIDataTypes;
  }[];
}

export type networkType = 'main' | 'morden' | 'ropsten' | 'rinkeby' | 'kovan' | 'unknown';
export type providerType = 'MetaMask' | 'Coinbase Wallet' | 'Cipher' | 'Trust' | 'Mist' | 'Parity';

export const WEB3_PROVIDER = new InjectionToken('WEB3_PROVIDER');

@Injectable()
export class Web3Service {
  status: ConnectionStatus;
  account: string;
  networkType: networkType;
  private existInNetwork: boolean;
  private _web3: Web3;
  private _intervalMock: Function;
  private _newWatchingAddress$: BehaviorSubject<string> = new BehaviorSubject(undefined);

  private readonly interval$: Observable<any> = Observable.of(undefined)
    .mergeMap(() => (this._intervalMock && this._intervalMock()) || Observable.interval(100))
    .share()
    .startWith(undefined);
  readonly newBlock$: Observable<number> = this.interval$
    .mergeMap(() => this.getBlockNumber())
    .distinctUntilChanged()
    .scan((prev, block) => [prev[1], block], [])
    .mergeMap(([prev, block]) => {
      if (!prev) {
        return Observable.of(block);
      }
      return Observable.from(new Array(block - prev).fill(0).map((_, i) => prev + 1 + i));
    })
    .share();
  readonly account$: Observable<string> = this.interval$
    .mergeMap(() => this.getAccount())
    .distinctUntilChanged()
    .shareReplay();
  readonly changes$: Observable<undefined> = Observable
    .merge(this.newBlock$, this.account$)
    .map(() => undefined)
    .share();
  readonly ethBalance$: Observable<number> = this.changes$
    .mergeMap(() => this.getEthBalance())
    .distinctUntilChanged()
    .shareReplay();
  readonly accountIfNetwork$: Observable<string> = this.interval$
    .mergeMap(() => this.getAccount())
    .filter(() => this.existInNetwork !== undefined);
  readonly status$: Observable<ConnectionStatus> = Observable
    .race(
      this.accountIfNetwork$,
      Observable.of(undefined)
        .delay(4000)
        .mergeMap(() => Observable.merge(
          Observable.of('timeout'),
          this.accountIfNetwork$,
        )),
    )
    .map((account: string | 'timeout'): ConnectionStatus => {
      if (!this.web3) {
        return ConnectionStatus.NoProvider;
      }
      if (account === 'timeout') {
        return ConnectionStatus.Timeout;
      }
      if (!account) {
        return ConnectionStatus.NoAccount;
      }
      if (!this.existInNetwork) {
        return ConnectionStatus.NoNetwork;
      }
      return ConnectionStatus.Total;
    })
    .distinctUntilChanged()
    .shareReplay(1);
  readonly watchingContractChanges$ = this._newWatchingAddress$
    .scan((acc, address) => [...acc, String(address).toLowerCase()].filter((_, i, list) => list.indexOf(_) === i), [])
    .filter(addrs => !!addrs.length)
    .mergeMap(addrs =>
      this.newBlock$
        .mergeMap(blockNumber => this.getBlock(blockNumber, true))
        .filter(_ => !!_)
        .map(({transactions}) => transactions.map(transaction => String(transaction.to).toLowerCase()))
        .mergeMap(changes => Observable.from(changes.filter(change => addrs.indexOf(change) !== -1))),
    )
    .share();

  get web3(): Web3 {
    return this._web3 || this.initWeb3();
  }

  constructor(@Optional() @Inject(WEB3_PROVIDER) private _web3Provider: () => any) {
    this.checkContractInNetwork();
    this.listenChanges();
  }

  static addABI(abi: any): void {
    abiDecoder.addABI(abi);
  }

  private listenChanges(): void {
    if (!this._intervalMock) {
      this.status$.subscribe(status => this.status = status);
      this.account$.subscribe(account => this.account = account);
      this.getNetworkType().subscribe(type => this.networkType = type);
    }
  }

  private initWeb3(): Web3 {
    if (this._web3Provider && this._web3Provider()) {
      return this._web3 = new (<any>Web3Module)(this._web3Provider());
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
    } else {
      this.existInNetwork = false;
    }
  }

  getAccount(): Observable<string> {
    if (this.web3 && this.web3.eth) {
      return Observable
        .fromPromise(this.web3.eth.getAccounts())
        .map(accounts => accounts[0] || undefined);
    }
    return Observable.of(undefined);
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

  getNetworkId(): Observable<number> {
    if (!this.web3) {
      return Observable.empty();
    }
    return Observable.fromPromise(this.web3.eth.net.getId())
      .map(_ => (+_) || undefined);
  }

  getNetworkType(): Observable<networkType> {
    return this.getNetworkId()
      .map(id => {
        switch (id) {
          case 1: return 'main';
          case 2: return 'morden';
          case 3: return 'ropsten';
          case 4: return 'rinkeby';
          case 42: return 'kovan';
          default: return 'unknown';
        }
      });
  }

  getProvider(): providerType {
    if (!this.web3) {
      return;
    }
    const cp = <any>this.web3.currentProvider;
    switch (true) {
      case cp.isMetaMask: return 'MetaMask';
      case cp.isToshi: return 'Coinbase Wallet';
      case cp.isCipher: return 'Cipher';
      case cp.isTrust: return 'Trust';
      case cp.constructor.name === 'EthereumProvider': return 'Mist';
      case cp.constructor.name === 'Web3FrameProvider': return 'Parity';
      default: return;
    }
  }

  watchContractChanges(address: string): Observable<string> {
    this._newWatchingAddress$.next(address);
    return this.watchingContractChanges$.filter(_ => _ === address).share();
  }

  getTransaction(tx: string): Observable<Transaction> {
    return Observable.fromPromise(this.web3.eth.getTransaction(tx));
  }

  getTransactionMetadata(transaction: Transaction): FullTransaction {
    if (!transaction) {
      return;
    }
    const {name, params} = abiDecoder.decodeMethod(transaction.input) || {name: '', params: []} as any;
    return {
      ...transaction,
      method: name,
      methodName: name.replace(/([A-Z])/g, ' $1').toLowerCase(),
      params,
    };
  }

  getBlock(number: BlockType, returnTransactions: boolean = false): Observable<Block> {
    return Observable.fromPromise(this.web3.eth.getBlock(number, returnTransactions));
  }

  getMetamaskInstallationLink(browser?: string): string {
    switch (browser || detect().name) {
      case 'chrome': return 'https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn';
      case 'firefox': return 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
      case 'opera': return 'https://addons.opera.com/en/extensions/details/metamask/';
      default: return 'https://metamask.io/';
    }
  }

  goToEtherscan(tx: string): void {
    const network = this.networkType;
    let url;

    switch (network) {
      case 'main':
        url = `https://etherscan.io/tx/${tx}`;
        break;
      case 'ropsten':
      case 'rinkeby':
      case 'kovan':
        url = `https://${network}.etherscan.io/tx/${tx}`;
        break;
      default: break;
    }
    if (url) {
      const etherscan = window.open(url, '_blank');
      etherscan.focus();
    }
  }
}
