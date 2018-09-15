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
      const address = (action.payload as {address: string}).address || <string>action.payload;
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

export const getKudosTokensById = (state: KudosTokenState) => state.kudosTokens;
export const getKudosTokens = (state: KudosTokenState) => Object.values(state.kudosTokens);
