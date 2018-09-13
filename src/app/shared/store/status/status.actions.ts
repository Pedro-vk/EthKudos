import { Action } from '@ngrx/store';

import { ConnectionStatus } from '../../web3.service';

export const SET_STATUS = 'status - set status';

// Status
export class SetStatusAction implements Action {
  readonly type = SET_STATUS;
  constructor(public payload: ConnectionStatus) { }
}

export type Actions
  = SetStatusAction;
