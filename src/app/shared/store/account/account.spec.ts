import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { hot, cold } from 'jasmine-marbles';

import { PROVIDERS } from '../../';
import { State, reducers } from '../';

import { reduceActions } from '../testing-utils';

import { accountReducer } from './account.reducers';
import * as fromAccount from './account.reducers';
import * as accountActions from './account.actions';
import { AccountEffects } from './account.effects';

describe('account - Reducers', () => {
  const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;

  it('should be auto-initialized', () => {
    const finalState = reduceActions(accountReducer);
    expect(finalState).not.toBeUndefined();
  });

  it('should set the account', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.SetAccountAction(newAccount(1)),
      new accountActions.SetAccountAction(newAccount(2)),
      new accountActions.SetAccountAction(newAccount(3)),
    ], true);

    const account = steps.map(fromAccount.getAccount);

    expect(account).toEqual([
      undefined,
      newAccount(1),
      newAccount(2),
      newAccount(3),
    ]);
  });

  it('should set the balance', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.SetBalanceAction(1111),
      new accountActions.SetBalanceAction(2222),
      new accountActions.SetBalanceAction(3333),
    ], true);

    const balance = steps.map(fromAccount.getBalance);

    expect(balance).toEqual([
      0,
      1111,
      2222,
      3333,
    ]);
  });
});
