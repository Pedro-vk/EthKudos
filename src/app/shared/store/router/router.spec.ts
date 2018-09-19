import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { hot, cold } from 'jasmine-marbles';

import { PROVIDERS } from '../../';
import { State, reducers } from '../';
import * as kudosTokenActions from '../kudos-token/kudos-token.actions';

import { RouterEffects } from './router.effects';

const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;

describe('Router - Effects', () => {
  let store: Store<State>;
  let effects: RouterEffects;
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
        RouterEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(RouterEffects);
    store = TestBed.get(Store);
  });

  it('should request the loading of the current kudos token', () => {
    actions = hot('-n', {
      n: {type: ROUTER_NAVIGATION, payload: {routerState: {url: '', root: {firstChild: {params: {tokenAddress: newAccount(1)}}}}}},
    });

    const expected = cold('-(ab)', {
      a: new kudosTokenActions.LoadBasicDataAction(newAccount(1)),
      b: new kudosTokenActions.LoadTotalDataAction(newAccount(1)),
    });

    expect(effects.loadKudosTokenOnOpen$).toBeObservable(expected);
  });
});
