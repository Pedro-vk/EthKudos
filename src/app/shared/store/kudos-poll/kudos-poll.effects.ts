import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Web3Service, KudosPollService, KudosPollFactoryService } from '../../';

import * as fromRoot from '../reducers';
import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollData } from './kudos-poll.models';

@Injectable()
export class KudosPollEffects {

  @Effect()
  getBasicKudosPollData$: Observable<Action> = this.actions$
    .ofType(kudosPollActions.LOAD_BASIC_DATA)
    .map(({payload}: kudosPollActions.LoadBasicDataAction) => payload)
    .mergeMap(({address, force}) =>
      this.setData(
        address,
        'basic',
        force,
        async(kudosPollService) => ({
          address,
          // version: await kudosPollService.version(),
          // name: await kudosPollService.name(),
          // symbol: await kudosPollService.symbol(),
          decimals: await kudosPollService.decimals(),
          totalSupply: await kudosPollService.totalSupply(),
          kudosByMember: await kudosPollService.kudosByMember(),
          maxKudosToMember: await kudosPollService.maxKudosToMember(),
          minDeadline: await kudosPollService.minDeadline() * 1000,
          creation: await kudosPollService.creation() * 1000,
        }),
      ),
    );

  @Effect()
  getDynamicKudosPollData$: Observable<Action> = this.actions$
    .ofType(kudosPollActions.LOAD_DYNAMIC_DATA)
    .map(({payload}: kudosPollActions.LoadDynamicDataAction) => payload)
    .mergeMap(({address, force}) =>
      this.setData(
        address,
        'dynamic',
        force,
        async(kudosPollService) => ({
          decimals: await kudosPollService.decimals(),
          canBeClosed: await kudosPollService.canBeClosed(),
          active: await kudosPollService.active(),
          members: await kudosPollService.getMembers(),
          balances: (await kudosPollService.getBalances() || []).reduce((acc, _) => ({...acc, [_.member]: _.balance}), {}),
          gratitudes: (await kudosPollService.allGratitudes() || [])
            .reduce((acc, gratitude) => ({
              ...acc,
              [gratitude.to]: [...(acc[gratitude.to] || []), gratitude],
            }), {}),
        }),
      ),
    );

  @Effect()
  getGratitudesOf$: Observable<Action> = this.actions$
    .ofType(kudosPollActions.LOAD_ACCOUNT_GRATITUDES)
    .map(({payload}: kudosPollActions.LoadAccountGratitudesAction) => payload)
    .mergeMap(({address, account}) =>
      this.getKudosPollServiceData(address, async kudosPollService => await kudosPollService.getGratitudesOf(account))
        .map(gratitudes => ({gratitudes, address, account})),
    )
    .map(({address, account, gratitudes}) => new kudosPollActions.SetGratitudesAction(address, account, gratitudes));

  @Effect()
  watchKudosPollChanges$: Observable<Action> = this.actions$
    .ofType(kudosPollActions.LOAD_DYNAMIC_DATA, kudosPollActions.LOAD_BASIC_DATA)
    .map(({payload}: kudosPollActions.LoadDynamicDataAction | kudosPollActions.LoadBasicDataAction) => payload)
    .map(({address}) => address)
    .distinct()
    .mergeMap((address) => this.web3Service.watchContractChanges(address))
    .mergeMap((address: string) =>
      this.store.select(_ => fromRoot.getKudosPollLoaded(address)(_))
        .first()
        .filter(_ => !!_)
        .mergeMap(({dynamic}) => {
          if (dynamic) {
            return Observable.of(new kudosPollActions.LoadDynamicDataAction(address, true));
          }
          return Observable.empty();
        }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.State>,
    private web3Service: Web3Service,
    private kudosPollFactoryService: KudosPollFactoryService,
  ) { }

  setData(
    address: string,
    type: 'basic' | 'dynamic' | undefined,
    force: boolean,
    dataGetter: (kudosPollService: KudosPollService) => Promise<Partial<KudosPollData>>,
  ) {
    return this.store.select(fromRoot.getKudosPollsById)
      .first()
      .filter(kudosPolls => !(kudosPolls && kudosPolls[address] && kudosPolls[address].loaded[type]) || force)
      .mergeMap(() => this.getKudosPollServiceData(address, dataGetter))
      .map(data => new kudosPollActions.SetPollDataAction(address, type, data));
  }

  getKudosPollServiceData(
    address: string,
    dataGetter: (kudosPollService: KudosPollService) => Promise<any>,
  ): Observable<any> {
    const kudosPollService = this.kudosPollFactoryService.getKudosPollServiceAt(address);
    return kudosPollService.onInitialized
      .first()
      .mergeMap(() => this.resolvePromise(dataGetter(kudosPollService)));
  }

  resolvePromise<T>(promise: Promise<T>): Observable<T> {
    return Observable.fromPromise(promise);
  }
}
