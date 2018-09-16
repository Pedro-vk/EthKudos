import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import * as kudosTokenActions from '../kudos-token/kudos-token.actions';

@Injectable()
export class RouterEffects {

  @Effect()
  loadKudosTokenOnOpen$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map(({payload}: RouterNavigationAction) => payload)
    .map(({routerState}) => routerState.root.firstChild && routerState.root.firstChild.params.tokenAddress)
    .filter(_ => !!_)
    .mergeMap(address => Observable.from([
      new kudosTokenActions.LoadBasicDataAction(address),
      new kudosTokenActions.LoadTotalDataAction(address),
    ]));

  constructor(private actions$: Actions) { }
}
