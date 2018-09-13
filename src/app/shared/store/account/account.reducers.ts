import * as accountActions from './account.actions';

import { FullTransaction } from '../../web3.service';

export interface AccountState {
  account: string;
  balance: number;
  pendingTransactions: {[account: string]: FullTransaction[]};
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
      };
    }

    case accountActions.SET_BALANCE: {
      return {
        ...state,
        balance: action.payload,
      };
    }

    default: return state;
  }
}

export const getAccount = (state: AccountState) => state.account;
export const getBalance = (state: AccountState) => state.balance;
export const getPendingTransactionsById = (state: AccountState) => state.pendingTransactions;
