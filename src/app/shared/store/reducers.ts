import { createSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

export interface State {
  routerReducer: RouterReducerState;
}

export const reducers = {
  routerReducer,
};

// Root selectors
export const getRouterState = (state: State) => state.routerReducer;
