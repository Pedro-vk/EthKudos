import { Action } from '@ngrx/store';

export const SET_ACCOUNT = 'account - set account';
export const SET_BALANCE = 'account - set balance';

// Account data
export class SetAccountAction implements Action {
  readonly type = SET_ACCOUNT;
  constructor(public payload: string) { }
}
export class SetBalanceAction implements Action {
  readonly type = SET_BALANCE;
  constructor(public payload: number) { }
}

export type Actions
  = SetAccountAction
  | SetBalanceAction;
