import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { StatusState, statusReducer } from './status/status.reducers';

import * as fromStatus from './status/status.reducers';

export interface State {
  routerReducer: RouterReducerState;
  statusReducer: StatusState;
}

export const reducers = {
  routerReducer,
  statusReducer,
};

// Root selectors
export const getRouterState = (state: State) => state.routerReducer;
export const getStatusState = (state: State) => state.statusReducer;

// Status
export const getStatus = createSelector(getStatusState, fromStatus.getStatus);
