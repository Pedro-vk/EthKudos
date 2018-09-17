import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AccountState, accountReducer } from './account/account.reducers';
import { KudosPollState, kudosPollReducer } from './kudos-poll/kudos-poll.reducers';
import { KudosTokenState, kudosTokenReducer } from './kudos-token/kudos-token.reducers';
import { StatusState, statusReducer } from './status/status.reducers';

import * as fromAccount from './account/account.reducers';
import * as fromKudosPoll from './kudos-poll/kudos-poll.reducers';
import * as fromKudosToken from './kudos-token/kudos-token.reducers';
import * as fromStatus from './status/status.reducers';

export interface State {
  accountReducer: AccountState;
  kudosPollReducer: KudosPollState;
  kudosTokenReducer: KudosTokenState;
  routerReducer: RouterReducerState;
  statusReducer: StatusState;
}

export const reducers = {
  accountReducer,
  kudosPollReducer,
  kudosTokenReducer,
  routerReducer,
  statusReducer,
};

/* tslint:disable:max-line-length */
// Root selectors
export const getAccountState = (state: State) => state.accountReducer;
export const getKudosPollState = (state: State) => state.kudosPollReducer;
export const getKudosTokenState = (state: State) => state.kudosTokenReducer;
export const getRouterState = (state: State) => state.routerReducer;
export const getStatusState = (state: State) => state.statusReducer;

// Account
export const getAccount = createSelector(getAccountState, fromAccount.getAccount);
export const getBalance = createSelector(getAccountState, fromAccount.getBalance);
export const getPendingTransactionsById = createSelector(getAccountState, fromAccount.getPendingTransactionsById);
export const getPendingTransactions = createSelector(getAccountState, fromAccount.getPendingTransactions);

// KudosPoll
export const getKudosPollsById = createSelector(getKudosPollState, fromKudosPoll.getKudosPollsById);
export const getKudosPolls = createSelector(getKudosPollState, fromKudosPoll.getKudosPolls);
export const getKudosPollByAddress = (address: string) => createSelector(getKudosPollState, fromKudosPoll.getKudosPollByAddress(address));
export const getKudosPollLoading = (address: string) => createSelector(getKudosPollState, fromKudosPoll.getKudosPollLoading(address));
export const getKudosPollLoaded = (address: string) => createSelector(getKudosPollState, fromKudosPoll.getKudosPollLoaded(address));

// KudosToken
export const getKudosTokensById = createSelector(getKudosTokenState, fromKudosToken.getKudosTokensById);
export const getKudosTokens = createSelector(getKudosTokenState, fromKudosToken.getKudosTokens);
export const getKudosTokenByAddress = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenByAddress(address));
export const getKudosTokenLoading = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenLoading(address));
export const getKudosTokenLoaded = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenLoaded(address));
export const getKudosTokenPolls = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenPolls(address));
export const getKudosTokenPreviousPolls = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenPreviousPolls(address));
export const getKudosTokenActivePoll = (address: string) => createSelector(getKudosTokenState, fromKudosToken.getKudosTokenActivePoll(address));

// Status
export const getStatus = createSelector(getStatusState, fromStatus.getStatus);

// Mixes
// Account + KudosPoll
export const getKudosPollByAddressWithAccountData = (address: string) => createSelector(getAccount, getKudosPollByAddress(address),
  (account, kudosPoll) => kudosPoll && ({
    ...kudosPoll,
    imMember: !!(kudosPoll.members || []).find(member => member === account),
    myBalance: ((kudosPoll.balances || {})[account] || 0) / 10 ** kudosPoll.decimals,
  }),
);

// Account + KudosToken
export const getKudosTokenByAddressWithAccountData = (address: string) => createSelector(getAccount, getKudosTokenByAddress(address),
  (account, kudosToken) => kudosToken && ({
    ...kudosToken,
    imOwner: kudosToken.owner && kudosToken.owner === account,
    imMember: !!(kudosToken.members || []).find(({member}) => member === account),
    myBalance: ((kudosToken.balances || {})[account] || 0) / 10 ** kudosToken.decimals,
    myContact: kudosToken.contacts && kudosToken.contacts[account],
  }),
);

// Account + KudosToken + router
export const getCurrentKudosTokenWithAccountData = createSelector(getRouterState, _ => _,
  (router, state) => {
    if (router && router.state.root.firstChild && router.state.root.firstChild.params.tokenAddress) {
      return getKudosTokenByAddressWithAccountData(router.state.root.firstChild.params.tokenAddress)(state);
    }
  },
);
