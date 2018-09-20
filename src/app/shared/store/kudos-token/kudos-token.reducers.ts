import { createSelector } from '@ngrx/store';

import * as kudosTokenActions from './kudos-token.actions';
import { KudosTokenData } from './kudos-token.models';

export interface KudosTokenState {
  kudosTokens: {
    [address: string]: KudosTokenData & {
      loading: boolean;
      loaded: {
        basic: boolean;
        total: boolean;
      };
    };
  };
}

const initialState: KudosTokenState = {
  kudosTokens: {},
};

export function kudosTokenReducer(state: KudosTokenState = initialState, action: kudosTokenActions.Actions): KudosTokenState {
  switch (action.type) {
    case kudosTokenActions.LOAD_BASIC_DATA:
    case kudosTokenActions.LOAD_TOTAL_DATA:
    case kudosTokenActions.LOAD_ACCOUNT_BALANCE: {
      const {address} = action.payload;
      return {
        ...state,
        kudosTokens: {
          ...state.kudosTokens,
          [address]: {
            ...(state.kudosTokens[address] || {} as any),
            loading: true,
            loaded: {
              ...((state.kudosTokens[address] || {} as any).loaded || {}),
            },
          },
        },
      };
    }

    case kudosTokenActions.SET_DATA: {
      const {address, type, data} = action.payload;
      return {
        ...state,
        kudosTokens: {
          ...state.kudosTokens,
          [address]: {
            ...(state.kudosTokens[address] || {} as any),
            loading: false,
            loaded: {
              ...((state.kudosTokens[address] || {} as any).loaded || {}),
              ...(type ? {[type]: true} : {}),
            },
            ...data,
          },
        },
      };
    }

    case kudosTokenActions.SET_BALANCE: {
      const {address, account, balance} = action.payload;
      return {
        ...state,
        kudosTokens: {
          ...state.kudosTokens,
          [address]: {
            ...(state.kudosTokens[address] || {} as any),
            loading: false,
            balances: {
              ...(state.kudosTokens[address] || {} as any).balances,
              [account]: balance,
            }
          },
        },
      };
    }

    default: return state;
  }
}

/* tslint:disable:max-line-length */
export const getKudosTokensById = (state: KudosTokenState) => state.kudosTokens;
export const getKudosTokens = (state: KudosTokenState) => Object.values(state.kudosTokens);

// By id
export const getKudosTokenByAddress = (address: string) => createSelector(getKudosTokensById,
  state => {
    if (!state[address] || !state[address].loaded.basic) {
      return;
    }
    return {
      ...state[address],
      members: (state[address].members || []).map(member => ({member, name: (state[address].contacts || {})[member]}))
    };
  }
);
export const getKudosTokenLoading = (address: string) => createSelector(getKudosTokenByAddress(address), state => (state || {} as any).loading);
export const getKudosTokenLoaded = (address: string) => createSelector(getKudosTokenByAddress(address), state => (state || {} as any).loaded);
export const getKudosTokenPolls = (address: string) => createSelector(getKudosTokenByAddress(address), (state): string[] => (state || {} as any).polls);
export const getKudosTokenPreviousPolls = (address: string) => createSelector(getKudosTokenByAddress(address),
  (state): string[] => ((state || {} as any).polls || []).slice(0, (state || {} as any).isActivePoll ? -1 : Infinity).reverse(),
);
export const getKudosTokenActivePoll = (address: string) => createSelector(getKudosTokenByAddress(address),
  (state): string => state && state.isActivePoll ? state.polls[state.polls.length - 1] : undefined,
);

