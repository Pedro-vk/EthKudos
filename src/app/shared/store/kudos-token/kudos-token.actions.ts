import { Action } from '@ngrx/store';

import { KudosTokenData } from './kudos-token.models';

export const LOAD_BASIC_DATA =      'kudos token - load basic data';
export const LOAD_TOTAL_DATA =      'kudos token - load total data';
export const LOAD_ACCOUNT_BALANCE = 'kudos token - load account balance';
export const SET_DATA =             'kudos token - set data';
export const SET_BALANCE =          'kudos token - set balance';

// Load data
export class LoadBasicDataAction implements Action {
  readonly type = LOAD_BASIC_DATA;
  payload: {address: string, force: boolean};
  constructor(address: string, force: boolean = false) {
    this.payload = {address, force};
  }
}
export class LoadTotalDataAction implements Action {
  readonly type = LOAD_TOTAL_DATA;
  payload: {address: string, force: boolean};
  constructor(address: string, force: boolean = false) {
    this.payload = {address, force};
  }
}
export class LoadAccountBalanceAction implements Action {
  readonly type = LOAD_ACCOUNT_BALANCE;
  payload: {address: string, account: string};
  constructor(address: string, account: string) {
    this.payload = {address, account};
  }
}

// Set data
export class SetTokenDataAction implements Action {
  readonly type = SET_DATA;
  payload: {address: string, type: 'basic' | 'total' | undefined, data: Partial<KudosTokenData>};
  constructor(address: string, type: 'basic' | 'total' | undefined, data: Partial<KudosTokenData>) {
    this.payload = {address, type, data};
  }
}
export class SetBalanceAction implements Action {
  readonly type = SET_BALANCE;
  payload: {address: string, account: string, balance: number};
  constructor(address: string, account: string, balance: number) {
    this.payload = {address, account, balance};
  }
}

export type Actions
  = LoadBasicDataAction
  | LoadTotalDataAction
  | LoadAccountBalanceAction
  | SetTokenDataAction
  | SetBalanceAction;
