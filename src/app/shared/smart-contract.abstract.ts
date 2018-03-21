import { Tx } from 'web3/types';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import { Web3Service } from './web3.service';
import { Contract, TruffleContract, TruffleContractConstantMethods, TruffleContractActionMethods, TruffleContractEventMethods } from './truffle.interface';

export abstract class SmartContract<C, A, E> {
  protected contract: TruffleContract<C, A, E>;

  constructor(protected web3Service: Web3Service) { }

  protected generateConstant<P extends keyof TruffleContractConstantMethods<C>>(constant: P): (...args) => Promise<C[P]> {
    return (...args) => (<any>this.contract)[constant](...args);
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
