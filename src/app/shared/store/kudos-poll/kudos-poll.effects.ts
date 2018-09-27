import { Injectable } from '@angular/core';
import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { from as observableFrom, merge as observableMerge, EMPTY, of as observableOf, Observable } from 'rxjs';
import { distinct, first, filter, mergeMap, map } from 'rxjs/operators';

import { Web3Service, KudosPollService, KudosPollFactoryService } from '../../';

import * as fromRoot from '../reducers';
import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollData } from './kudos-poll.models';

@Injectable()
export class KudosPollEffects {

  @Effect()
  getBasicKudosPollData$: Observable<Action> = this.actions$.pipe(
    ofType(kudosPollActions.LOAD_BASIC_DATA),
    map(({payload}: kudosPollActions.LoadBasicDataAction) => payload),
    mergeMap(({address, force}) =>
      observableMerge(
        this.setData(address, undefined, true, async(kudosPollService) => ({address})),
        this.setData(
          address,
          'basic',
          force,
          async(kudosPollService) => ({
            address,
            minDeadline: await kudosPollService.minDeadline() * 1000,
            creation: await kudosPollService.creation() * 1000,
          }),
        ),
        this.setData(
          address,
          undefined,
          true,
          async(kudosPollService) => ({
            kudosByMember: await kudosPollService.kudosByMember(),
            maxKudosToMember: await kudosPollService.maxKudosToMember(),
            totalSupply: await kudosPollService.totalSupply(),
          }),
        ),
      )
    ));

  @Effect()
  getDynamicKudosPollData$: Observable<Action> = this.actions$.pipe(
    ofType(kudosPollActions.LOAD_DYNAMIC_DATA),
    map(({payload}: kudosPollActions.LoadDynamicDataAction) => payload),
    mergeMap(({address, force}) =>
      this.setData(
        address,
        'dynamic',
        force,
        async(kudosPollService) => ({
          decimals: +await kudosPollService.decimals(),
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
    ));

  @Effect()
  watchKudosPollChanges$: Observable<Action> = this.actions$.pipe(
    ofType(kudosPollActions.LOAD_DYNAMIC_DATA, kudosPollActions.LOAD_BASIC_DATA),
    map(({payload}: kudosPollActions.LoadDynamicDataAction | kudosPollActions.LoadBasicDataAction) => payload),
    map(({address}) => address),
    distinct(),
    mergeMap((address) => this.web3Service.watchContractChanges(address)),
    mergeMap((address: string) =>
      this.store.pipe(
        select(_ => fromRoot.getKudosPollLoaded(address)(_)),
        first(),
        filter(_ => !!_),
        mergeMap(({dynamic}) => {
          if (dynamic) {
            return observableOf(new kudosPollActions.LoadDynamicDataAction(address, true));
          }
          return EMPTY;
        })),
    ));

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
    return this.store.pipe(
      select(fromRoot.getKudosPollsById),
      first(),
      filter(kudosPolls => !(kudosPolls && kudosPolls[address] && kudosPolls[address].loaded[type]) || force),
      mergeMap(() => this.getKudosPollServiceData(address, dataGetter)),
      map(data => new kudosPollActions.SetPollDataAction(address, type, data)));
  }

  getKudosPollServiceData(
    address: string,
    dataGetter: (kudosPollService: KudosPollService) => Promise<any>,
  ): Observable<any> {
    const kudosPollService = this.kudosPollFactoryService.getKudosPollServiceAt(address);
    return kudosPollService.onInitialized.pipe(
      first(),
      mergeMap(() => this.resolvePromise(dataGetter(kudosPollService))));
  }

  resolvePromise<T>(promise: Promise<T>): Observable<T> {
    return observableFrom(promise);
  }
}
