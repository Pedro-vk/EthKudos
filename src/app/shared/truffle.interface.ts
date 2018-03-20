import { Provider, Tx } from 'web3/types';

interface TruffleContractMethodBase<T> {
  call(...args: any[]): Promise<T>;
  estimateGas(): Promise<number>;
  sendTransaction(): Promise<string>;
}

interface TruffleContractMethodConstant<T> extends TruffleContractMethodBase<T> {
  (...args: any[]): Promise<T>;
}

interface TruffleContractMethodActions<T> extends TruffleContractMethodBase<T> {
  (...args: any[]): Promise<Tx>;
}

type TruffleContractConstantMethods<T> = {
  [P in keyof T]: TruffleContractMethodConstant<T[P]>;
}
type TruffleContractActionMethods<T> = {
  [P in keyof T]: TruffleContractMethodConstant<T[P]>;
}

interface TruffleContractBase<C, A> {
  address: string;
  abi: any[];
}

export type TruffleContract<C, A> = TruffleContractBase<C, A> & TruffleContractConstantMethods<C> & TruffleContractActionMethods<A>;

export interface Contract<T extends TruffleContract<any, any>> {
  at(string): Promise<T>;
  deployed(): Promise<T>;
  setProvider(Provider): void;
}
