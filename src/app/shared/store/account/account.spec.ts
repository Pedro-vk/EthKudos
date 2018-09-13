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

const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;

describe('Account - Reducers', () => {
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

describe('Account - Effects', () => {
  let store: Store<State>;
  let effects: AccountEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...reducers,
        }),
      ],
      providers: [
        ...PROVIDERS,
        AccountEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(AccountEffects);
    store = TestBed.get(Store);
  });

  it('should watch for account changes', () => {
    const fakeAddress = cold('--a--b--c', {
      a: newAccount(1),
      b: newAccount(2),
      c: newAccount(3),
    });

    spyOn(effects, 'getWeb3Account').and.returnValue(fakeAddress);

    actions = hot('-a', {
      a: {type: ROOT_EFFECTS_INIT},
    });

    const expected = cold('---a--b--c', {
      a: new accountActions.SetAccountAction(newAccount(1)),
      b: new accountActions.SetAccountAction(newAccount(2)),
      c: new accountActions.SetAccountAction(newAccount(3)),
    });

    expect(effects.watchAccountChanges$).toBeObservable(expected);
  });

  it('should watch for balance changes', () => {
    const fakeAddress = cold('--a--b--c', {
      a: 1111,
      b: 2222,
      c: 3333,
    });

    spyOn(effects, 'getWeb3Balance').and.returnValue(fakeAddress);

    actions = hot('-a', {
      a: {type: ROOT_EFFECTS_INIT},
    });

    const expected = cold('---a--b--c', {
      a: new accountActions.SetBalanceAction(1111),
      b: new accountActions.SetBalanceAction(2222),
      c: new accountActions.SetBalanceAction(3333),
    });

    expect(effects.watchBalanceChanges$).toBeObservable(expected);
  });
});
