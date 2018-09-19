import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AccountState, accountReducer } from './account/account.reducers';
import { KudosPollState, kudosPollReducer, generateResultsFromState } from './kudos-poll/kudos-poll.reducers';
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
    maxKudosToMember: kudosPoll.maxKudosToMember / 10 ** kudosPoll.decimals,
    kudosByMember: kudosPoll.kudosByMember / 10 ** kudosPoll.decimals,
    imMember: !!(kudosPoll.members || []).find(member => member === account),
    myBalance: ((kudosPoll.balances || {})[account] || 0) / 10 ** kudosPoll.decimals,
    myKudos: ((kudosPoll.kudos || {})[account] || 0) / 10 ** kudosPoll.decimals,
    myGratitudes: ((kudosPoll.gratitudes || {})[account] || []).map(gratitude => ({...gratitude, kudos: gratitude.kudos / 10 ** kudosPoll.decimals})),
  }),
);

// KudosPoll + KudosToken
export const getKudosPollWithContacts = (pollAddress: string, tokenAddress) => createSelector(
  getKudosPollByAddressWithAccountData(pollAddress),
  getKudosTokenByAddress(tokenAddress),
  (kudosPoll = <any> {}, kudosToken = <any> {}) => ({
    ...kudosPoll,
    allGratitudes: (kudosPoll.allGratitudes || [])
      .map(gratitude => ({
        ...gratitude,
        fromName: kudosToken.contacts[gratitude.from],
        toName: kudosToken.contacts[gratitude.to],
      })),
    results: (kudosPoll.results || [])
      .map(result => ({
        ...result,
        name: kudosToken.contacts[result.member],
        kudos: result.kudos / 10 ** kudosPoll.decimals,
      }))
      .sort((a, b) => b.kudos - a.kudos),
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

// Account + KudosToken + KudosPoll
export const getKudosTokenByAddressWithPolls = (address: string) => createSelector(
  _ => _,
  getKudosTokenByAddressWithAccountData(address),
  getKudosTokenPreviousPolls(address),
  getKudosTokenActivePoll(address),
  getKudosTokenPolls(address),
  (state, kudosToken = <any>{}, previousPolls = [], activePoll, allPollsAddress = []) => {
    const polls = previousPolls.map(kudosPollAddress => getKudosPollWithContacts(kudosPollAddress, kudosToken.address)(state));
    const allPolls = allPollsAddress.map(kudosPollAddress => getKudosPollWithContacts(kudosPollAddress, kudosToken.address)(state));
    const pendingPolls = allPolls.filter(kudosPoll => !kudosPoll || kudosPoll.loading || !(kudosPoll.loaded || {} as any).basic).length;
    const pendingFullPolls = allPolls
      .filter(kudosPoll =>
        !kudosPoll || kudosPoll.loading || !(kudosPoll.loaded || {} as any).basic || !(kudosPoll.loaded || {} as any).dynamic,
      )
      .length;
    const loaded = pendingPolls === 0;
    return {
      ...kudosToken,
      loadingPolls: {total: allPolls.length, pending: pendingPolls, pendingFull: pendingFullPolls, loaded},
      allPolls: loaded ? allPolls : [],
      previousPolls: loaded ? polls : [],
      activePoll: getKudosPollWithContacts(activePoll, kudosToken.address)(state),
    };
  },
);

// Account + KudosToken + KudosPoll + router
export const getCurrentKudosTokenWithFullData = createSelector(getRouterState, _ => _,
  (router, state) => {
    if (router && router.state.root.firstChild && router.state.root.firstChild.params.tokenAddress) {
      const selectedKudosPollAddress = router.state.root.firstChild.firstChild && router.state.root.firstChild.firstChild.params.address;
      const kudosToken = getKudosTokenByAddressWithPolls(router.state.root.firstChild.params.tokenAddress)(state);
      const loadedStatus = {
        loaded: {
          ...kudosToken.loaded,
          polls: kudosToken.loadingPolls && kudosToken.loadingPolls.loaded,
          pollsProgress: kudosToken.loadingPolls,
        },
        loadingPolls: <never>undefined,
      };
      const {members, decimals, previousPolls} = kudosToken;
      if (
        [members, decimals, previousPolls].indexOf(undefined) !== -1
        || previousPolls.length === 0
        || previousPolls.findIndex(kudosPoll => !(kudosPoll && kudosPoll.gratitudes)) !== -1
      ) {
        return <never>{...kudosToken, ...loadedStatus};
      }
      const membersList = previousPolls.map(kudosPoll => kudosPoll.members).reduce((acc, _) => [...acc, ..._], []);
      const results = generateResultsFromState({
        members: members.map(({member}) => member),
        decimals,
        gratitudes: previousPolls
          .map(kudosPoll => Object.entries(kudosPoll.gratitudes))
          .reduce((acc, _) => [...acc, ..._], [])
          .reduce((acc, [member, gratitudes]) => ({
            ...acc,
            [member]: [...(acc[member] || []), ...gratitudes],
          }), {}),
      });
      return {
        ...kudosToken,
        ...results,
        ...loadedStatus,
        selectedPoll: (kudosToken.allPolls || []).find(({address}) => address === selectedKudosPollAddress),
        results: results.results
          .map(result => ({
            ...result,
            name: kudosToken.contacts[result.member],
            achievements: {...result.achievements, beginner: membersList.indexOf(result.member) === -1},
          }))
          .sort((a, b) => b.kudos - a.kudos),
      };
    }
  },
);
