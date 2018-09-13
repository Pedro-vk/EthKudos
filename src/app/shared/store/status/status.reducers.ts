import * as statusActions from './status.actions';
import { ConnectionStatus } from '../../web3.service';

export interface StatusState {
  status: ConnectionStatus | undefined;
}

const initialState: StatusState = {
  status: undefined,
};

export function statusReducer(state: StatusState = initialState, action: statusActions.Actions): StatusState {
  switch (action.type) {
    case statusActions.SET_STATUS: {
      return {
        ...state,
        status: action.payload,
      };
    }

    default: return state;
  }
}

export const getStatus = (state: StatusState) => state.status;
