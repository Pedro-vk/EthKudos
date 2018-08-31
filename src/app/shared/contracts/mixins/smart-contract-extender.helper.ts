import { use } from 'typescript-mix';

import { SmartContract } from '../smart-contract.abstract';

type Constructor<T> = new(...args: any[]) => T;
type C<T> = Constructor<T>;
type BaseSmartContract = SmartContract<any, any, any, any>;
type B = BaseSmartContract;

/* tslint:disable:max-line-length */
export function SmartContractExtender<T1 extends B, T2 extends B, T3 extends B, T4 extends B, T5 extends B>(t1: C<T1>, t2: C<T2>, t3: C<T3>, t4: C<T4>, t5: C<T5>): C<T1 & T2 & T3 & T4 & T5>;
export function SmartContractExtender<T1 extends B, T2 extends B, T3 extends B, T4 extends B>(t1: C<T1>, t2: C<T2>, t3: C<T3>, t4: C<T4>): C<T1 & T2 & T3 & T4>;
export function SmartContractExtender<T1 extends B, T2 extends B, T3 extends B>(t1: C<T1>, t2: C<T2>, t3: C<T3>): C<T1 & T2 & T3>;
export function SmartContractExtender<T1 extends B, T2 extends B>(t1: C<T1>, t2: C<T2>): C<T1 & T2>;
export function SmartContractExtender<T1 extends B>(t1: C<T1>): C<T1>;

export function SmartContractExtender<T extends BaseSmartContract>(...mixins: Constructor<T>[]): any {
  const klass: any = class extends SmartContract<any, any, any, any> { };
  use(...mixins.reverse())(new klass(), undefined);
  return <any>klass;
}
