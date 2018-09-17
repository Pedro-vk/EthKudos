import { Action } from '@ngrx/store';

import { KudosPollData, KudosPollGratitude } from './kudos-poll.models';

export const LOAD_BASIC_DATA =          'kudos poll - load basic data';
export const LOAD_DYNAMIC_DATA =        'kudos poll - load dynamic data';
export const LOAD_ACCOUNT_GRATITUDES =  'kudos poll - load account gratitudes';
export const SET_DATA =                 'kudos poll - set data';
export const SET_BALANCE =              'kudos poll - set balance';
export const SET_GRATITUDES =           'kudos poll - set gratitudes';

// Load data
export class LoadBasicDataAction implements Action {
  readonly type = LOAD_BASIC_DATA;
  payload: {address: string, force: boolean};
  constructor(address: string, force: boolean = false) {
    this.payload = {address, force};
  }
}
export class LoadDynamicDataAction implements Action {
  readonly type = LOAD_DYNAMIC_DATA;
  payload: {address: string, force: boolean};
  constructor(address: string, force: boolean = false) {
    this.payload = {address, force};
  }
}
export class LoadAccountGratitudesAction implements Action {
  readonly type = LOAD_ACCOUNT_GRATITUDES;
  payload: {address: string, account: string};
  constructor(address: string, account: string) {
    this.payload = {address, account};
  }
}

// Set data
export class SetPollDataAction implements Action {
  readonly type = SET_DATA;
  payload: {address: string, type: 'basic' | 'dynamic' | undefined, data: Partial<KudosPollData>};
  constructor(address: string, type: 'basic' | 'dynamic' | undefined, data: Partial<KudosPollData>) {
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
export class SetGratitudesAction implements Action {
  readonly type = SET_GRATITUDES;
  payload: {address: string, account: string, gratitudes: KudosPollGratitude[]};
  constructor(address: string, account: string, gratitudes: KudosPollGratitude[]) {
    this.payload = {address, account, gratitudes};
  }
}

export type Actions
  = LoadBasicDataAction
  | LoadDynamicDataAction
  | LoadAccountGratitudesAction
  | SetPollDataAction
  | SetBalanceAction
  | SetGratitudesAction;
