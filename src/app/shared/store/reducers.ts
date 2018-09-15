import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AccountState, accountReducer } from './account/account.reducers';
import { KudosTokenState, kudosTokenReducer } from './kudos-token/kudos-token.reducers';
import { StatusState, statusReducer } from './status/status.reducers';

import * as fromAccount from './account/account.reducers';
import * as fromKudosToken from './kudos-token/kudos-token.reducers';
import * as fromStatus from './status/status.reducers';

export interface State {
  accountReducer: AccountState;
  kudosTokenReducer: KudosTokenState;
  routerReducer: RouterReducerState;
  statusReducer: StatusState;
}

export const reducers = {
  accountReducer,
  kudosTokenReducer,
  routerReducer,
  statusReducer,
};

// Root selectors
export const getAccountState = (state: State) => state.accountReducer;
export const getKudosTokenState = (state: State) => state.kudosTokenReducer;
export const getRouterState = (state: State) => state.routerReducer;
export const getStatusState = (state: State) => state.statusReducer;

// Account
export const getAccount = createSelector(getAccountState, fromAccount.getAccount);
export const getBalance = createSelector(getAccountState, fromAccount.getBalance);
export const getPendingTransactionsById = createSelector(getAccountState, fromAccount.getPendingTransactionsById);
export const getPendingTransactions = createSelector(getAccountState, fromAccount.getPendingTransactions);

// KudosToken
export const getKudosTokensById = createSelector(getKudosTokenState, fromKudosToken.getKudosTokensById);
export const getKudosTokens = createSelector(getKudosTokenState, fromKudosToken.getKudosTokens);

// Status
export const getStatus = createSelector(getStatusState, fromStatus.getStatus);
