import { Provider, Tx } from 'web3/types';

interface TruffleContractEventResponse<T extends {[key: string]: any}> {
  event: string;
  args: T;
}

interface TruffleContractMethodEvent<T> {
  stopWatching(): void;
  watch(callback: (err: any, event: TruffleContractEventResponse<T>) => void): any;
}

interface TruffleContractMethodBase<T> {
  call(...args: any[]): Promise<T>;
  estimateGas(): Promise<number>;
  sendTransaction(): Promise<string>;
}

interface TruffleContractMethodConstant<T> extends TruffleContractMethodBase<T> {
  (...args: any[]): Promise<T>;
}

interface TruffleContractMethodAction<T> extends TruffleContractMethodBase<T> {
  (...args: any[]): Promise<Tx>;
}

export type TruffleContractConstantMethods<T> = {
  [P in keyof T]: TruffleContractMethodConstant<T[P]>;
};
export type TruffleContractConstantIteratorMethods<T extends {[p: string]: any[]}> = {
  [P in keyof T]: Promise<T>;
};
export type TruffleContractActionMethods<T> = {
  [P in keyof T]: TruffleContractMethodAction<T[P]>;
};
export type TruffleContractEventMethods<T> = {
  [P in keyof T]: () => TruffleContractMethodEvent<T[P]>;
};

interface TruffleContractBase {
  address: string;
  abi: any[];
}

export type TruffleContract<C, CI extends {[p: string]: any[]}, A, E>
  = TruffleContractBase
  & TruffleContractConstantMethods<C>
  & TruffleContractConstantIteratorMethods<CI>
  & TruffleContractActionMethods<A>
  & TruffleContractEventMethods<E>;

export interface Contract<T extends TruffleContract<any, any, any, any>> {
  at(string): Promise<T>;
  deployed(): Promise<T>;
  setProvider(Provider): void;
}
