import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { State, reducers } from '../';

import { reduceActions } from '../testing-utils';

import { ConnectionStatus } from '../../web3.service';

import { statusReducer } from './status.reducers';
import * as fromStatus from './status.reducers';
import * as statusActions from './status.actions';

describe('Status - Reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(statusReducer);
    expect(finalState).not.toBeUndefined();
  });

  it('should be able to update the status', () => {
    const steps = reduceActions(statusReducer, [
      new statusActions.SetStatusAction(ConnectionStatus.NoNetwork),
      new statusActions.SetStatusAction(ConnectionStatus.NoProvider),
      new statusActions.SetStatusAction(ConnectionStatus.NoAccount),
      new statusActions.SetStatusAction(ConnectionStatus.Total),
    ], true);

    const status = steps.map(fromStatus.getStatus);

    expect(status).toEqual([
      undefined,
      ConnectionStatus.NoNetwork,
      ConnectionStatus.NoProvider,
      ConnectionStatus.NoAccount,
      ConnectionStatus.Total,
    ]);
  });
});
