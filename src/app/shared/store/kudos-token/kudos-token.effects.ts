import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Web3Service, KudosTokenService, KudosTokenFactoryService } from '../../';

import * as fromRoot from '../reducers';
import * as kudosTokenActions from './kudos-token.actions';
import { KudosTokenData } from './kudos-token.models';

@Injectable()
export class KudosTokenEffects {

  @Effect()
  loadBalanceOfCurrentAccount$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .mergeMap(() => this.store.select(fromRoot.getAccount))
    .filter(_ => !!_)
    .distinctUntilChanged()
    .mergeMap(account =>
      this.store.select(fromRoot.getKudosTokensById)
        .map(_ => Object.keys(_))
        .distinctUntilChanged((a, b) => a.toString() === b.toString())
        .mergeMap((addresses: string[] = []) =>
          Observable.from(addresses.map(address => new kudosTokenActions.LoadAccountBalanceAction(address, account))),
        ),
    );

  @Effect()
  getBasicKudosTokenData$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_BASIC_DATA)
    .map(({payload}: kudosTokenActions.LoadBasicDataAction) => payload)
    .mergeMap(({address, force}) =>
      this.setData(
        address,
        'basic',
        force,
        async(kudosTokenService) => ({
          address,
          version: await kudosTokenService.version(),
          organisationName: await kudosTokenService.organisationName() || await kudosTokenService.name(),
          name: await kudosTokenService.name(),
          symbol: await kudosTokenService.symbol(),
          decimals: await kudosTokenService.decimals(),
          totalSupply: await kudosTokenService.totalSupply(),
          members: await kudosTokenService.getMembers(),
          balances: (await kudosTokenService.getBalances() || []).reduce((acc, _) => ({...acc, [_.member]: _.balance}), {}),
        }),
      ),
    );

  @Effect()
  getTotalKudosTokenData$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_TOTAL_DATA)
    .map(({payload}: kudosTokenActions.LoadTotalDataAction) => payload)
    .mergeMap(({address, force}) =>
      this.setData(
        address,
        'total',
        force,
        async(kudosTokenService) => ({
          owner: await kudosTokenService.owner(),
          contacts: (await kudosTokenService.getContacts() || []).reduce((acc, _) => ({...acc, [_.member]: _.name}), {}),
          polls: await kudosTokenService.getPolls(),
          isActivePoll: await kudosTokenService.isActivePoll(),
        }),
      ),
    );

  @Effect()
  getBalanceOfAccount$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_ACCOUNT_BALANCE)
    .map(({payload}: kudosTokenActions.LoadAccountBalanceAction) => payload)
    .mergeMap(({address, account}) =>
      this.store.select(fromRoot.getKudosTokenByAddress(address))
        .first()
        .map(kudosToken => ((kudosToken && kudosToken.balances) || {})[account])
        .filter(_ => !!_)
        .mergeMap(() => this.getKudosTokenServiceData(address, (async kudosTokenService => await kudosTokenService.balanceOf(account))))
        .map(balance => new kudosTokenActions.SetBalanceAction(address, account, balance)),
    );

  @Effect()
  watchKudosTokenChanges$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_TOTAL_DATA, kudosTokenActions.LOAD_BASIC_DATA)
    .map(({payload}: kudosTokenActions.LoadTotalDataAction | kudosTokenActions.LoadBasicDataAction) => payload)
    .map(({address}) => address)
    .distinct()
    .mergeMap((address) => this.web3Service.watchContractChanges(address))
    .mergeMap((address: string) =>
      this.store.select(_ => fromRoot.getKudosTokenLoaded(address)(_))
        .first()
        .filter(_ => !!_)
        .mergeMap(({basic, total}) => {
          const actions = [];
          if (basic) {
            actions.push(new kudosTokenActions.LoadBasicDataAction(address, true));
          }
          if (total) {
            actions.push(new kudosTokenActions.LoadTotalDataAction(address, true));
          }
          return Observable.from(actions);
        }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.State>,
    private web3Service: Web3Service,
    private kudosTokenFactoryService: KudosTokenFactoryService,
  ) { }

  setData(
    address: string,
    type: 'basic' | 'total' | undefined,
    force: boolean,
    dataGetter: (kudosTokenService: KudosTokenService) => Promise<Partial<KudosTokenData>>,
  ) {
    return this.store.select(fromRoot.getKudosTokensById)
      .first()
      .filter(kudosTokens => !(kudosTokens && kudosTokens[address] && kudosTokens[address].loaded[type]) || force)
      .mergeMap(() => this.getKudosTokenServiceData(address, dataGetter))
      .map(data => new kudosTokenActions.SetTokenDataAction(address, type, data));
  }

  getKudosTokenServiceData(
    address: string,
    dataGetter: (kudosTokenService: KudosTokenService) => Promise<any>,
  ): Observable<any> {
    const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(address);
    return kudosTokenService.onIsValid
      .filter(_ => !!_)
      .first()
      .mergeMap(() => this.resolvePromise(dataGetter(kudosTokenService)));
  }

  resolvePromise<T>(promise: Promise<T>): Observable<T> {
    return Observable.fromPromise(promise);
  }
}
