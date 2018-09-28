import { Action } from '@ngrx/store';

import { ConnectionStatus, providerType, networkType } from '../../web3.service';

export const SET_STATUS    = 'status - set status';
export const SET_PROVIDER  = 'status - set provider';
export const SET_NETWORK   = 'status - set network';

// Status
export class SetStatusAction implements Action {
  readonly type = SET_STATUS;
  constructor(public payload: ConnectionStatus) { }
}

// Provider
export class SetProviderAction implements Action {
  readonly type = SET_PROVIDER;
  constructor(public payload: providerType) { }
}

// Network
export class SetNetworkAction implements Action {
  readonly type = SET_NETWORK;
  payload: {id: number, name: networkType};
  constructor(id: number, name: networkType) {
    this.payload = {id, name};
  }
}

export type Actions
  = SetStatusAction
  | SetProviderAction
  | SetNetworkAction;
