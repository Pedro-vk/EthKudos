import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import {
  interval as observableInterval, combineLatest as observableCombineLatest,
  from as observableFrom, of as observableOf, Observable,
} from 'rxjs';
import { startWith, first, mergeMap, map, filter, distinctUntilChanged, scan, takeWhile } from 'rxjs/operators';

import { Transaction } from 'web3/types';

import { Web3Service } from '../../web3.service';

import * as fromRoot from '../reducers';
import * as accountActions from './account.actions';

@Injectable()
export class AccountEffects {

  @Effect()
  watchAccountChanges$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    first(),
    mergeMap(() => this.getWeb3Account()),
    map(account => new accountActions.SetAccountAction(account)));

  @Effect()
  watchBalanceChanges$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    first(),
    mergeMap(() => this.getWeb3Balance()),
    map(balance => new accountActions.SetBalanceAction(balance)));

  @Effect()
  getMetadataOfNewTransactions$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ADD_NEW_TRANSACTION),
    map(({payload}: accountActions.AddNewTransactionAction) => payload),
    mergeMap(tx => this.web3Service.getTransaction(tx)),
    map(transaction => this.web3Service.getTransactionMetadata(transaction)),
    filter(_ => !!_),
    map(metadata => new accountActions.SetTransactionMetadataAction(metadata.hash, metadata)));

  @Effect()
  removeTransactionOnConfirmations$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.SET_TRANSACTION_CONFIRMATIONS),
    map(({payload}: accountActions.SetTransactionConfirmationsAction) => payload),
    filter(({confirmations}) => confirmations >= 24),
    map(({tx}) => new accountActions.RemoveTransactionAction(tx)));

  private txAdded: string[] = [];
  private txRemoved: string[] = [];
  @Effect()
  getPreviousPendingTransactions$: Observable<Action> = <any>this.actions$.pipe( // Workaround because `pipe` with more than 8 params
    ofType(accountActions.SET_ACCOUNT),
    map(({payload}: accountActions.SetAccountAction) => payload),
    mergeMap(account =>
      this.getCheckInterval().pipe(
        filter(() => !!this.web3Service.web3),
        mergeMap(() => this.web3Service.getBlock('pending')),
        distinctUntilChanged((a, b) => a.size === b.size),
        mergeMap(() => this.web3Service.getBlock('pending', true)),
        map(({transactions}) =>
          transactions.filter(transaction => (transaction.from || '').toLowerCase() === (account || '').toLowerCase()),
        ),
        map(transactions => transactions.map(tx => tx.hash)),
        distinctUntilChanged((a, b) => a.join('|') === b.join('|')),
        scan((acc, transactions) =>
          [...acc, ...transactions]
            .filter((tx, i, list) => list.indexOf(tx) === i)
            .filter(_ => !!_),
          [],
        ),
        mergeMap(txs =>
          observableCombineLatest(observableOf(undefined), ...txs.map(tx => this.web3Service.getTransaction(tx))).pipe(
            map(transactions => transactions.filter(_ => !!_)),
            map(transactions => ({transactions, txs}))),
        ),
        mergeMap(({transactions, txs}) => {
          const isRemoved = tx => !transactions.find(transaction => transaction && transaction.hash === tx);
          const isAccepted = tx => !!transactions.find(transaction => transaction && transaction.hash === tx && !!transaction.blockNumber);
          const actions: Action[] = [
            ...txs
              .filter(tx => this.txAdded.indexOf(tx) === -1)
              .map(tx => this.txAdded.push(tx) && new accountActions.AddNewTransactionAction(tx)),
            ...txs
              .filter(tx => this.txRemoved.indexOf(tx) === -1)
              .filter(tx => isAccepted(tx) || isRemoved(tx))
              .map(tx => this.txRemoved.push(tx) && new accountActions.RemoveTransactionAction(tx)),
          ];
          if (txs.length === this.txAdded.length && txs.length === this.txRemoved.length) {
            actions.push(<any>false);
          }
          return observableFrom(actions);
        }),
        takeWhile((flag: any) => flag !== false)),
    ));

  constructor(private actions$: Actions, private store: Store<fromRoot.State>, private web3Service: Web3Service) { }

  getWeb3Account() {
    return this.web3Service.account$;
  }
  getWeb3Balance() {
    return this.web3Service.ethBalance$;
  }
  getCheckInterval() {
    return observableInterval(1000 / 4).pipe(
      startWith(undefined));
  }
}
