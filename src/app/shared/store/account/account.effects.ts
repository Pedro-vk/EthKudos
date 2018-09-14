import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
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

  @Effect()
  getMetadataOfNewTransactions$: Observable<Action> = this.actions$
    .ofType(accountActions.ADD_NEW_TRANSACTION)
    .map(({payload}: accountActions.AddNewTransactionAction) => payload)
    .mergeMap(tx => this.web3Service.getTransaction(tx))
    .map(transaction => this.web3Service.getTransactionMetadata(transaction))
    .map(metadata => new accountActions.SetTransactionMetadataAction(metadata.hash, metadata));

  @Effect()
  removeTransactionOnConfirmations$: Observable<Action> = this.actions$
    .ofType(accountActions.SET_TRANSACTION_CONFIRMATIONS)
    .map(({payload}: accountActions.SetTransactionConfirmationsAction) => payload)
    .filter(({confirmations}) => confirmations >= 24)
    .map(({tx}) => new accountActions.RemoveTransactionAction(tx));

  constructor(private actions$: Actions, private web3Service: Web3Service) { }

  getWeb3Account() {
    return this.web3Service.account$;
  }

  getWeb3Balance() {
    return this.web3Service.ethBalance$;
  }
}
