import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap, first } from 'rxjs/operators';

import { Web3Service } from '../../web3.service';

import * as statusActions from './status.actions';

@Injectable()
export class StatusEffects {

  @Effect()
  watchStatusChanges$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    first(),
    mergeMap(() => this.getWeb3Status()),
    map(status => new statusActions.SetStatusAction(status)));

  constructor(private actions$: Actions, private web3Service: Web3Service) { }

  getWeb3Status() {
    return this.web3Service.status$;
  }
}
