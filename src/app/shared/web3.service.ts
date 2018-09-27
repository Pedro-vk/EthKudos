import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import {
  merge as observableMerge, of as observableOf, interval as observableInterval, from as observableFrom,
  EMPTY,  Observable,  Subject, BehaviorSubject,
} from 'rxjs';
import { catchError, share, startWith, shareReplay, map, filter, distinctUntilChanged, mergeMap, scan } from 'rxjs/operators';
import Web3 from 'web3';
import * as Web3Module from 'web3';
import { Transaction, ABIDataTypes, Block, BlockType } from 'web3/types';
import * as abiDecoder from 'abi-decoder';
import * as contract from 'truffle-contract';
import { detect } from 'detect-browser';

import * as Migrations from '../../../build/contracts/Migrations.json';

export enum ConnectionStatus {
  Total = 'total',
  NoAccount = 'no-account',
  NoProvider = 'no-provider',
  NoNetwork = 'no-network',
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

  private readonly interval$: Observable<any> = observableOf(undefined).pipe(
    mergeMap(() => (this._intervalMock && this._intervalMock()) || observableInterval(100)),
    share(),
    startWith(undefined));
  readonly newBlock$: Observable<number> = this.interval$.pipe(
    mergeMap(() => this.getBlockNumber()),
    distinctUntilChanged(),
    scan((prev, block) => [prev[1], block], <any>[]),
    mergeMap(([prev, block]) => {
      if (!prev) {
        return observableOf(block);
      }
      return observableFrom(new Array(block - prev).fill(0).map((_, i) => prev + 1 + i));
    }),
    share());
  readonly account$: Observable<string> = this.interval$.pipe(
    mergeMap(() => this.getAccount()),
    distinctUntilChanged(),
    shareReplay());
  readonly changes$: Observable<undefined> = observableMerge(this.newBlock$, this.account$).pipe(
    map(() => undefined),
    share());
  readonly ethBalance$: Observable<number> = this.changes$.pipe(
    mergeMap(() => this.getEthBalance()),
    distinctUntilChanged(),
    shareReplay());
  readonly status$: Observable<ConnectionStatus> = this.interval$.pipe(
    mergeMap(() => this.getAccount()),
    filter(() => this.existInNetwork !== undefined),
    map((account): ConnectionStatus => {
      if (!this.web3) {
        return ConnectionStatus.NoProvider;
      }
      if (!account) {
        return ConnectionStatus.NoAccount;
      }
      if (!this.existInNetwork) {
        return ConnectionStatus.NoNetwork;
      }
      return ConnectionStatus.Total;
    }),
    distinctUntilChanged(),
    shareReplay(1));
  readonly watchingContractChanges$: Observable<string> = this._newWatchingAddress$.pipe(
    scan((acc, address) => [...acc, String(address).toLowerCase()].filter((_, i, list) => list.indexOf(_) === i), <any>[]),
    filter(addrs => !!addrs.length),
    mergeMap(addrs =>
      this.newBlock$.pipe(
        mergeMap(blockNumber => this.getBlock(blockNumber, true)),
        filter(_ => !!_),
        map(({transactions}) => transactions.map(transaction => String(transaction.to).toLowerCase())),
        mergeMap(changes => observableFrom(changes.filter(change => addrs.indexOf(change) !== -1)))),
    ),
    share());

  get web3(): Web3 {
    return this._web3 || this.initWeb3();
  }

  constructor(@Optional() @Inject(WEB3_PROVIDER) private _web3Provider: any) {
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
    if (this._web3Provider) {
      return this._web3 = new (<any>Web3Module)(this._web3Provider);
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
      return observableFrom(this.web3.eth.getAccounts()).pipe(
        map(accounts => accounts[0] || undefined));
    }
    return observableOf(undefined);
  }

  getEthBalance(): Observable<number> {
    if (!this.web3) {
      return observableOf(undefined);
    }
    return this.getAccount().pipe(
      mergeMap(account => observableFrom(this.web3.eth.getBalance(account))),
      map(balance => +this.web3.utils.fromWei(balance, 'ether')),
      catchError(() => observableOf(undefined)));
  }

  getBlockNumber(): Observable<number> {
    if (this.web3) {
      return observableFrom(this.web3.eth.getBlockNumber());
    }
    return EMPTY;
  }

  checkUpdates<T>(checkObservable: (Web3Service) => Observable<T>): Observable<T> {
    return this.changes$.pipe(
      mergeMap(() => checkObservable(this)),
      distinctUntilChanged());
  }

  getNetworkId(): Observable<number> {
    if (!this.web3) {
      return EMPTY;
    }
    return observableFrom(this.web3.eth.net.getId()).pipe(
      map(_ => (+_) || undefined));
  }

  getNetworkType(): Observable<networkType> {
    return this.getNetworkId().pipe(
      map(id => {
        switch (id) {
          case 1: return 'main';
          case 2: return 'morden';
          case 3: return 'ropsten';
          case 4: return 'rinkeby';
          case 42: return 'kovan';
          default: return 'unknown';
        }
      }));
  }

  watchContractChanges(address: string): Observable<string> {
    this._newWatchingAddress$.next(address);
    return this.watchingContractChanges$.pipe(filter(_ => _ === address), share());
  }

  getTransaction(tx: string): Observable<Transaction> {
    return observableFrom(this.web3.eth.getTransaction(tx));
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
    return observableFrom(this.web3.eth.getBlock(number, returnTransactions));
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
