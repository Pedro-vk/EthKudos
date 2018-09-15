import { Action } from '@ngrx/store';

import { FullTransaction } from '../../web3.service';

export const SET_ACCOUNT =                    'account - set account';
export const SET_BALANCE =                    'account - set balance';
export const ADD_NEW_TRANSACTION =            'account - new transaction';
export const SET_TRANSACTION_METADATA =       'account - set transaction metadata';
export const REMOVE_NEW_TRANSACTION =         'account - remove transaction';
export const SET_TRANSACTION_CONFIRMATIONS =  'account - set transaction confirmations';

// Account data
export class SetAccountAction implements Action {
  readonly type = SET_ACCOUNT;
  constructor(public payload: string) { }
}
export class SetBalanceAction implements Action {
  readonly type = SET_BALANCE;
  constructor(public payload: number) { }
}

// Confirmations
export class AddNewTransactionAction implements Action {
  readonly type = ADD_NEW_TRANSACTION;
  constructor(public payload: string) { }
}
export class SetTransactionMetadataAction implements Action {
  readonly type = SET_TRANSACTION_METADATA;
  payload: {tx: string, metadata: FullTransaction};
  constructor(tx: string, metadata: FullTransaction) {
    this.payload = {tx, metadata};
  }
}
export class RemoveTransactionAction implements Action {
  readonly type = REMOVE_NEW_TRANSACTION;
  constructor(public payload: string) { }
}
export class SetTransactionConfirmationsAction implements Action {
  readonly type = SET_TRANSACTION_CONFIRMATIONS;
  payload: {tx: string, confirmations: number};
  constructor(tx: string, confirmations: number) {
    this.payload = {tx, confirmations};
  }
}

export type Actions
  = SetAccountAction
  | SetBalanceAction
  | AddNewTransactionAction
  | SetTransactionMetadataAction
  | RemoveTransactionAction
  | SetTransactionConfirmationsAction;
