import * as Web3Module from 'web3';
import { Tx, ABIDefinition, TransactionReceipt, Contract as Web3Contract } from 'web3/types';
import * as truffleContract from 'truffle-contract';
import { Store } from '@ngrx/store';
import { EMPTY, from as observableFrom, merge as observableMerge,  Observable,  Subject, BehaviorSubject } from 'rxjs';
import { share, catchError, distinctUntilChanged, mergeMap, filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Web3Service } from '../web3.service';
import {
  Contract, TruffleContract,
  TruffleContractConstantMethods, TruffleContractConstantIteratorMethods, TruffleContractActionMethods, TruffleContractEventMethods,
} from './truffle.interface';
import * as accountActions from '../store/account/account.actions';

export const emptyPromise: () => Promise<undefined> = () => Promise.resolve(undefined);

export abstract class SmartContract<C, CI extends {[p: string]: any[]}, A, E> {
  protected readonly _onInitialized: BehaviorSubject<any> = new BehaviorSubject(undefined);
  readonly onInitialized: Observable<any> = this._onInitialized.pipe(filter(_ => !!_));
  protected contract: TruffleContract<C, CI, A, E>;
  protected web3Contract: Web3Contract;
  protected readonly isBigNumber = _ => (new (<any>Web3Module)()).utils.isBigNumber(_) || (new (<any>Web3Module)()).utils.isBN(_);

  get initialized(): boolean {
    return !!this.contract;
  }
  set initialized(value: boolean) {
    if (value) {
      this._onInitialized.next(true);
    }
  }

  get address(): string {
    return (this.contract || {} as any).address;
  }

  constructor(protected web3Service: Web3Service, protected store: Store<any>) { }

  checkUpdates<T>(fn: (context: this) => Promise<T>): Observable<T> {
    return observableMerge(this.web3Service.changes$, this.onInitialized).pipe(
      filter(() => this.initialized),
      mergeMap(() => observableFrom(fn(this))),
      distinctUntilChanged(),
      catchError(e => console.warn('checkUpdates error: ', {fn, e}) || EMPTY),
      share());
  }

  async fromDecimals(value: number): Promise<number> {
    const decimals = await ((<any>this.contract).decimals || emptyPromise)();
    return value * (10 ** decimals);
  }

  async fromInt(value: number): Promise<number> {
    const decimals = await ((<any>this.contract).decimals || emptyPromise)();
    return value / (10 ** decimals);
  }

  protected getContract(smartContractDescriptor: any): Contract<TruffleContract<C, CI, A, E>> {
    const contractLoader = truffleContract(smartContractDescriptor);
    contractLoader.setProvider(this.web3Service.web3.currentProvider);
    return contractLoader;
  }

  protected getWeb3Contract(abi: ABIDefinition[], address: string): Web3Contract {
    return new this.web3Service.web3.eth.Contract(abi, address);
  }

  protected generateConstant<P extends string & keyof TruffleContractConstantMethods<C>>(
    constant: P,
    mapper?: (response: any) => C[P]
  ): (...args) => Promise<C[P]> {

    return (...args) =>
      new Promise((resolve, reject) => {
        if (!this.contract) {
          resolve(undefined);
          return;
        }
        (<any>this.contract)[constant](...args)
          .then(result => {
            if (this.isBigNumber(result)) {
              result = +result;
            }
            if (result instanceof Array) {
              result = result.map(_ => this.isBigNumber(_) ? +_ : _);
            }
            resolve(mapper ? mapper(result) : result);
          });
      });
  }

  protected async generateConstantIteration<P extends string & keyof TruffleContractConstantIteratorMethods<CI>>(
    lengthFn: () => Promise<number>,
    getter: (i: number) => Promise<CI[P][0]>
  ): Promise<CI[P]> {

    const length = await lengthFn();
    return await Promise.all(
      Array.from(new Array(+length))
        .map((_, i) => getter(i)),
    );
  }

  protected generateAction<P extends string & keyof TruffleContractActionMethods<A>>(
    action: P,
  ): ((...args) => (Promise<TransactionReceipt> & {$observable: Observable<'error' | 'done' | 'waiting'>})) {

    return (...args) => {
      const subject = new Subject<'error' | 'done' | 'waiting'>();
      const promise = <any>new Promise<TransactionReceipt>((resolve, reject) => {
        let tx;
        const config: any = {from: this.web3Service.account};
        if (environment.defaultGasLimit) {
          config.gas = environment.defaultGasLimit;
        }
        try {
          this.web3Contract.methods[action](...args)
            .send(config)
            .on('transactionHash', txHash => {
              tx = txHash;
              subject.next('waiting');
              this.store.dispatch(new accountActions.AddNewTransactionAction(tx));
            })
            .on('confirmation', confirmations => {
              this.store.dispatch(new accountActions.SetTransactionConfirmationsAction(tx, confirmations));
            })
            .on('error', error => {
              subject.next('error');
              reject({error});
            })
            .then(receipt => {
              subject.next('done');
              resolve(receipt);
            });
        } catch (error) {
          subject.next('error');
          reject({error});
        }
      });
      promise.$observable = subject.asObservable();
      return promise;
    };
  }

  protected generateEventObservable<P extends string & keyof TruffleContractEventMethods<E>>(event: P): Observable<E[P]> {
    return this.onInitialized.pipe(
      mergeMap(() =>
        Observable
          .create(observer => (<any>this.contract)[event]().watch((e, _) => observer.next(_.args)))
          .share(),
      ));
  }

  protected n(number: any): number {
    return +number || 0;
  }
}
