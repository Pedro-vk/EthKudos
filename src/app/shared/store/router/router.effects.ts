import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import * as fromRoot from '../reducers';
import * as kudosPollActions from '../kudos-poll/kudos-poll.actions';
import * as kudosTokenActions from '../kudos-token/kudos-token.actions';

@Injectable()
export class RouterEffects {

  @Effect()
  loadKudosTokenOnOpen$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map(({payload}: RouterNavigationAction) => payload)
    .map(({routerState}) => routerState.root.firstChild && routerState.root.firstChild.params.tokenAddress)
    .filter(_ => !!_)
    .distinctUntilChanged()
    .mergeMap(address =>
      Observable.merge(
        Observable.from([
          new kudosTokenActions.LoadBasicDataAction(address),
          new kudosTokenActions.LoadTotalDataAction(address),
        ]),
        this.store.select(fromRoot.getKudosTokenPolls(address))
          .mergeMap(kudosPolls => Observable.from([...(kudosPolls || [])].reverse()))
          .filter(_ => !!_)
          .distinct()
          .delay(1000)
          .mergeMap(kudosPollAddress => Observable.from([
            new kudosPollActions.LoadBasicDataAction(kudosPollAddress),
            new kudosPollActions.LoadDynamicDataAction(kudosPollAddress),
          ])),
      ),
    );

  constructor(private actions$: Actions, private store: Store<fromRoot.State>) { }
}
