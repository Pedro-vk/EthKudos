import { createSelector } from '@ngrx/store';

import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollData } from './kudos-poll.models';

export interface KudosPollState {
  kudosPolls: {
    [address: string]: KudosPollData & {
      loading: boolean;
      loaded: {
        basic: boolean;
        dynamic: boolean;
      };
    };
  };
}

const initialState: KudosPollState = {
  kudosPolls: {},
};

export function kudosPollReducer(state: KudosPollState = initialState, action: kudosPollActions.Actions): KudosPollState {
  switch (action.type) {
    case kudosPollActions.LOAD_BASIC_DATA:
    case kudosPollActions.LOAD_DYNAMIC_DATA:
    case kudosPollActions.LOAD_ACCOUNT_GRATITUDES: {
      const {address} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: true,
            loaded: {
              ...((state.kudosPolls[address] || {} as any).loaded || {}),
            },
          },
        },
      };
    }

    case kudosPollActions.SET_DATA: {
      const {address, type, data} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: false,
            loaded: {
              ...((state.kudosPolls[address] || {} as any).loaded || {}),
              ...(type ? {[type]: true} : {}),
            },
            ...data,
          },
        },
      };
    }

    case kudosPollActions.SET_BALANCE: {
      const {address, account, balance} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: false,
            balances: {
              ...(state.kudosPolls[address] || {} as any).balances,
              [account]: balance,
            }
          },
        },
      };
    }

    case kudosPollActions.SET_GRATITUDES: {
      const {address, account, gratitudes} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: false,
            gratitudes: {
              ...(state.kudosPolls[address] || {} as any).gratitudes,
              [account]: gratitudes,
            }
          },
        },
      };
    }

    default: return state;
  }
}

/* tslint:disable:max-line-length */
export const getKudosPollsById = (state: KudosPollState) => state.kudosPolls;
export const getKudosPolls = (state: KudosPollState) => Object.values(state.kudosPolls);

// By id
export const getKudosPollByAddress = (address: string) => createSelector(getKudosPollsById,
  state => {
    if (!state[address] || !state[address].loaded.basic) {
      return;
    }
    return state[address];
  }
);
export const getKudosPollLoading = (address: string) => createSelector(getKudosPollByAddress(address), state => (state || {} as any).loading);
export const getKudosPollLoaded = (address: string) => createSelector(getKudosPollByAddress(address), state => (state || {} as any).loaded);

