import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import { hot, cold } from 'jasmine-marbles';

import { PROVIDERS } from '../../';
import { State, reducers } from '../';

import { reduceActions } from '../testing-utils';

import { kudosPollReducer } from './kudos-poll.reducers';
import * as fromKudosPoll from './kudos-poll.reducers';
import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollEffects } from './kudos-poll.effects';

const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;
const newTx = n => `0x${'0'.repeat(65 - String(n).length)}${n}`;

describe('KudosPoll - Reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(kudosPollReducer);
    expect(finalState).not.toBeUndefined();
  });

  it('should set loading state', () => {
    const steps = reduceActions(kudosPollReducer, [
      new kudosPollActions.LoadBasicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', {}),
      new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'dynamic', {}),
      new kudosPollActions.LoadBasicDataAction(newAccount(2)),
      new kudosPollActions.SetPollDataAction(newAccount(2), 'basic', {}),
    ], true);

    const kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);

    expect(kudosPolls).toEqual([
      {},
      {[newAccount(1)]: {loading: true, loaded: {}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}}},
      {[newAccount(1)]: {loading: true, loaded: {basic: true}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true, dynamic: true}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true, dynamic: true}}, [newAccount(2)]: {loading: true, loaded: {}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true, dynamic: true}}, [newAccount(2)]: {loading: false, loaded: {basic: true}}},
    ]);
  });

  it('should set the data of a KudosPoll', () => {
    const steps = reduceActions(kudosPollReducer, [
      new kudosPollActions.LoadBasicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', {name: 'test'}),
      new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'dynamic', {active: true}),
    ], true);

    const kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);

    expect(kudosPolls).toEqual([
      {},
      {[newAccount(1)]: {loading: true, loaded: {}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}, name: 'test'}},
      {[newAccount(1)]: {loading: true, loaded: {basic: true}, name: 'test'}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true, dynamic: true}, name: 'test', active: true}},
    ]);
  });

  it('should set the balance of a member', () => {
    const steps = reduceActions(kudosPollReducer, [
      new kudosPollActions.LoadBasicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', {name: 'test'}),
      new kudosPollActions.SetBalanceAction(newAccount(1), newAccount(11), 9 * 10 ** 17),
    ], true);

    const kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);

    expect(kudosPolls).toEqual([
      {},
      {[newAccount(1)]: {loading: true, loaded: {}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}, name: 'test'}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}, name: 'test', balances: {[newAccount(11)]: 9 * 10 ** 17}}},
    ]);
  });

  it('should set the gratitudes of a member', () => {
    const steps = reduceActions(kudosPollReducer, [
      new kudosPollActions.LoadBasicDataAction(newAccount(1)),
      new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', {name: 'test'}),
      new kudosPollActions.SetGratitudesAction(newAccount(1), newAccount(11), [{from: newAccount(90), kudos: 5, message: 'test'}]),
    ], true);

    const kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);

    expect(kudosPolls).toEqual([
      {},
      {[newAccount(1)]: {loading: true, loaded: {}}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}, name: 'test'}},
      {[newAccount(1)]: {loading: false, loaded: {basic: true}, name: 'test', gratitudes: {
        [newAccount(11)]: [{from: newAccount(90), kudos: 5, message: 'test'}]}
      }},
    ]);
  });
});

describe('KudosPoll - Effects', () => {
  let store: Store<State>;
  let effects: KudosPollEffects;
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
        KudosPollEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(KudosPollEffects);
    store = TestBed.get(Store);
  });
});
