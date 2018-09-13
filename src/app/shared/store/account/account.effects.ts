import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Web3Service } from '../../web3.service';

import * as accountActions from './account.actions';

@Injectable()
export class AccountEffects {

  @Effect()
  watchAccountChanges$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .first()
    .mergeMap(() => this.getWeb3Account())
    .map(account => new accountActions.SetAccountAction(account));

  @Effect()
  watchBalanceChanges$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .first()
    .mergeMap(() => this.getWeb3Balance())
    .map(balance => new accountActions.SetBalanceAction(balance));

  constructor(private actions$: Actions, private web3Service: Web3Service) { }

  getWeb3Account() {
    return this.web3Service.account$;
  }

  getWeb3Balance() {
    return this.web3Service.ethBalance$;
  }
}
