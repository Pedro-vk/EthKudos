import { Injectable } from '@angular/core';
import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { from as observableFrom, merge as observableMerge, of as observableOf, Observable } from 'rxjs';
import { map, mergeMap, distinctUntilChanged, filter, distinct, delay } from 'rxjs/operators';

import * as fromRoot from '../reducers';
import * as kudosPollActions from '../kudos-poll/kudos-poll.actions';
import * as kudosTokenActions from '../kudos-token/kudos-token.actions';

@Injectable()
export class RouterEffects {

  @Effect()
  loadKudosTokenOnOpen$: Observable<Action> = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    map(({payload}: RouterNavigationAction) => payload),
    map(({routerState}) => routerState.root.firstChild && {
      address: routerState.root.firstChild.params.tokenAddress,
      selectedPoll:
        routerState.url.match(/\/active/) ?
          'active' :
          routerState.root.firstChild.firstChild && routerState.root.firstChild.firstChild.params.address,
    }),
    filter(({address}) => address),
    distinctUntilChanged((a, b) => a.address === b.address),
    mergeMap(({address, selectedPoll}) =>
      observableMerge(
        observableFrom([
          new kudosTokenActions.LoadBasicDataAction(address),
          new kudosTokenActions.LoadTotalDataAction(address),
        ]),
        this.store.pipe(
          select(fromRoot.getKudosTokenPolls(address)),
          mergeMap((kudosPolls = []) => {
            const firstPoll = selectedPoll === 'active' || !selectedPoll ? kudosPolls[kudosPolls.length - 1] : selectedPoll;
            const polls = (kudosPolls || []).filter(_ => _ !== firstPoll).reverse();
            return observableMerge(
              observableOf((firstPoll || '').toLowerCase()),
              observableFrom(kudosPolls).pipe(delay(selectedPoll ? 6000 : 2000)),
            );
          }),
          filter(_ => !!_),
          distinct(),
          mergeMap(kudosPollAddress => observableFrom([
            new kudosPollActions.LoadBasicDataAction(kudosPollAddress),
            new kudosPollActions.LoadDynamicDataAction(kudosPollAddress),
          ]))),
      ),
    ));

  constructor(private actions$: Actions, private store: Store<fromRoot.State>) { }
}
