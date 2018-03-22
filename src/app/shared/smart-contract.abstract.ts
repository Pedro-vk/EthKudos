import Web3 from 'web3';
import { Tx } from 'web3/types';
import contract from 'truffle-contract';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import { Web3Service } from './web3.service';
import {
  Contract, TruffleContract,
  TruffleContractConstantMethods, TruffleContractConstantIteratorMethods, TruffleContractActionMethods, TruffleContractEventMethods,
} from './truffle.interface';

export abstract class SmartContract<C, CI extends {[p: string]: any[]}, A, E> {
  protected contract: TruffleContract<C, CI, A, E>;
  private isBigNumber = (new Web3()).utils.isBigNumber;

  constructor(protected web3Service: Web3Service) { }

  protected getContract(smartContractDescriptor: any): Contract<TruffleContract<C, CI, A, E>> {
    const contractLoader = contract(smartContractDescriptor);
    contractLoader.setProvider(this.web3Service.web3.currentProvider);
    return contractLoader;
  }

  protected generateConstant<P extends keyof TruffleContractConstantMethods<C>>(constant: P, mapper?: (response: any) => C[P]): (...args) => Promise<C[P]> {
    return (...args) =>
      new Promise(resolve => {
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

  protected async generateConstantIteration<P extends keyof TruffleContractConstantIteratorMethods<CI>>(lengthFn: () => Promise<number>, getter: (i: number) => Promise<CI[P][0]>): Promise<CI[P]> {
    const length = await lengthFn();
    return await Promise.all(
      Array.from(new Array(+length))
        .map((_, i) => getter(i)),
    );
  }

  protected generateAction<P extends keyof TruffleContractActionMethods<A>>(action: P): (...args) => Promise<Tx> {
    return (...args) => (<any>this.contract)[action](...args, {from: this.web3Service.account});
  }

  protected generateEventObservable<P extends keyof TruffleContractEventMethods<E>>(event: P): Observable<E[P]> {
    return Observable
      .create(observer => (<any>this.contract)[event]().watch((e, _) => observer.next(_.args)))
      .share();
  }
}
