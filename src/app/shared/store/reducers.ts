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

/* tslint:disable:max-line-length */
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
export const getKudosTokenByAddress = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenByAddress(address));
export const getKudosTokenLoading = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenLoading(address));
export const getKudosTokenLoaded = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenLoaded(address));

// Status
export const getStatus = createSelector(getStatusState, fromStatus.getStatus);

// Mixes
// Account + KudosToken
export const getKudosTokenByAddressWithAccountData = (address: string) => createSelector(getAccount, getKudosTokenByAddress(address),
  (account, kudosToken) => kudosToken && ({
    ...kudosToken,
    imMember: !!(kudosToken.members || []).find(({member}) => member === account),
    myBalance: ((kudosToken.balances || {})[account] || 0) / 10 ** kudosToken.decimals,
  }),
);
