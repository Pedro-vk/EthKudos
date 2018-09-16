import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Transaction } from 'web3/types';

import { KudosTokenFactoryService } from '../../kudos-token-factory.service';
import { KudosTokenService } from '../../contracts/kudos-token.service';

import * as fromRoot from '../reducers';
import * as kudosTokenActions from './kudos-token.actions';
import { KudosTokenData } from './kudos-token.models';

@Injectable()
export class KudosTokenEffects {

  @Effect()
  getBasicKudosTokenData$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_BASIC_DATA)
    .map(({payload}: kudosTokenActions.LoadBasicDataAction) => payload)
    .mergeMap(address =>
      this.setData(
        address,
        'basic',
        async(kudosTokenService) => ({
          address,
          version: await kudosTokenService.version(),
          organisationName: await kudosTokenService.organisationName() || await kudosTokenService.name(),
          name: await kudosTokenService.name(),
          symbol: await kudosTokenService.symbol(),
          decimals: await kudosTokenService.decimals(),
          totalSupply: await kudosTokenService.totalSupply(),
          members: await kudosTokenService.getMembers(),
        }),
      ),
    );

  @Effect()
  getTotalKudosTokenData$: Observable<Action> = this.actions$
    .ofType(kudosTokenActions.LOAD_TOTAL_DATA)
    .map(({payload}: kudosTokenActions.LoadTotalDataAction) => payload)
    .mergeMap(address =>
      this.setData(
        address,
        'total',
        async(kudosTokenService) => ({
          contacts: await kudosTokenService.getContacts(),
          polls: await kudosTokenService.getPolls(),
          isActivePoll: await kudosTokenService.isActivePoll(),
          balances: await kudosTokenService.getBalances(),
        }),
      ),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.State>,
    private kudosTokenFactoryService: KudosTokenFactoryService,
  ) { }

  setData(
    address: string,
    type: 'basic' | 'total' | undefined,
    dataGetter: (kudosTokenService: KudosTokenService) => Promise<Partial<KudosTokenData>>,
  ) {
    return this.store.select(fromRoot.getKudosTokensById)
      .first()
      .filter(kudosTokens => !(kudosTokens[address] && kudosTokens[address].loaded[type]))
      .mergeMap(() => {
        const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(address);
        return kudosTokenService.onIsValid
          .filter(_ => !!_)
          .first()
          .mergeMap(() => this.resolvePromise(dataGetter(kudosTokenService)));
      })
      .map(data => new kudosTokenActions.SetTokenDataAction(address, type, data));
  }

  resolvePromise(promise: Promise<any>) {
    return Observable.fromPromise(promise);
  }
}
