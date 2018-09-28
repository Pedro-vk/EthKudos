import * as statusActions from './status.actions';
import { ConnectionStatus, providerType, networkType } from '../../web3.service';

export interface StatusState {
  status: ConnectionStatus | undefined;
  network: {id: number, name: networkType};
  provider: providerType;
}

const initialState: StatusState = {
  status: undefined,
  network: {id: undefined, name: undefined},
  provider: undefined,
};

export function statusReducer(state: StatusState = initialState, action: statusActions.Actions): StatusState {
  switch (action.type) {
    case statusActions.SET_STATUS: {
      return {
        ...state,
        status: action.payload,
      };
    }

    case statusActions.SET_NETWORK: {
      return {
        ...state,
        network: action.payload,
      };
    }

    case statusActions.SET_PROVIDER: {
      return {
        ...state,
        provider: action.payload,
      };
    }

    default: return state;
  }
}

export const getStatus = (state: StatusState) => state.status;
export const getNetwork = (state: StatusState) => state.network;
export const getNetworkId = (state: StatusState) => state.network.id;
export const getNetworkName = (state: StatusState) => state.network.name;
export const getProvider = (state: StatusState) => state.provider;
