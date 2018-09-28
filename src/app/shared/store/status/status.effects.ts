import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Web3Service } from '../../web3.service';

import * as statusActions from './status.actions';

@Injectable()
export class StatusEffects {

  @Effect()
  watchStatusChanges$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .first()
    .mergeMap(() => this.getWeb3Status())
    .map(status => new statusActions.SetStatusAction(status));

  @Effect()
  setNetworkData$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .first()
    .mergeMap(() => Observable.combineLatest(this.web3Service.getNetworkId(), this.web3Service.getNetworkType()))
    .map(([id, name]) => new statusActions.SetNetworkAction(id, name));

  @Effect()
  setProviderType$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .map(() => this.web3Service.getProvider())
    .first()
    .map(provider => new statusActions.SetProviderAction(provider));

  constructor(private actions$: Actions, private web3Service: Web3Service) { }

  getWeb3Status() {
    return this.web3Service.status$;
  }
}
