import * as accountActions from './account.actions';

import { FullTransaction } from '../../web3.service';

export interface AccountState {
  account: string;
  balance: number;
  pendingTransactions: {[tx: string]: FullTransaction};
}

const initialState: AccountState = {
  account: undefined,
  balance: 0,
  pendingTransactions: {},
};

export function accountReducer(state: AccountState = initialState, action: accountActions.Actions): AccountState {
  switch (action.type) {
    case accountActions.SET_ACCOUNT: {
      return {
        ...state,
        account: action.payload,
        pendingTransactions: {},
      };
    }

    case accountActions.SET_BALANCE: {
      return {
        ...state,
        balance: action.payload,
      };
    }

    case accountActions.ADD_NEW_TRANSACTION: {
      const tx = action.payload;
      return {
        ...state,
        pendingTransactions: {
          ...state.pendingTransactions,
          [tx]: {
            ...(state.pendingTransactions[tx] || {} as any),
          },
        },
      };
    }

    case accountActions.SET_TRANSACTION_METADATA: {
      const {tx, metadata} = action.payload;
      return {
        ...state,
        pendingTransactions: {
          ...state.pendingTransactions,
          [tx]: {
            ...(state.pendingTransactions[tx] || {} as any),
            ...metadata,
          },
        },
      };
    }

    case accountActions.REMOVE_NEW_TRANSACTION: {
      const tx = action.payload;
      const pendingTransactions = {...state.pendingTransactions};
      delete pendingTransactions[tx];
      return {
        ...state,
        pendingTransactions,
      };
    }

    case accountActions.SET_TRANSACTION_CONFIRMATIONS: {
      const {tx, confirmations} = action.payload;
      return {
        ...state,
        pendingTransactions: {
          ...state.pendingTransactions,
          [tx]: {
            ...(state.pendingTransactions[tx] || {} as any),
            confirmations,
          },
        },
      };
    }

    default: return state;
  }
}

export const getAccount = (state: AccountState) => (state.account || '').toLowerCase() || undefined;
export const getBalance = (state: AccountState) => state.balance;
export const getPendingTransactionsById = (state: AccountState) => state.pendingTransactions;
export const getPendingTransactions = (state: AccountState) => Object.values(state.pendingTransactions).filter(_ => !!_.hash);
