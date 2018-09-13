import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AccountState, accountReducer } from './account/account.reducers';
import { StatusState, statusReducer } from './status/status.reducers';

import * as fromAccount from './account/account.reducers';
import * as fromStatus from './status/status.reducers';

export interface State {
  accountReducer: AccountState;
  routerReducer: RouterReducerState;
  statusReducer: StatusState;
}

export const reducers = {
  accountReducer,
  routerReducer,
  statusReducer,
};

// Root selectors
export const getAccountState = (state: State) => state.accountReducer;
export const getRouterState = (state: State) => state.routerReducer;
export const getStatusState = (state: State) => state.statusReducer;

// Account
export const getAccount = createSelector(getAccountState, fromAccount.getAccount);
export const getBalance = createSelector(getAccountState, fromAccount.getBalance);

// Status
export const getStatus = createSelector(getStatusState, fromStatus.getStatus);
