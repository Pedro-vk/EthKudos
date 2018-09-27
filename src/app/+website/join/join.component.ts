import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest as observableCombineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, mergeMap, shareReplay } from 'rxjs/operators';

import * as fromRoot from '../../shared/store/reducers';
import * as kudosTokenActions from '../../shared/store/kudos-token/kudos-token.actions';

import { Web3Service, KudosTokenFactoryService, cardInOutAnimation } from '../../shared';

@Component({
  selector: 'eth-kudos-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  animations: [cardInOutAnimation],
})
export class JoinComponent {
  copied: boolean;
  joinName$ = new Subject<string>();
  @ViewChild('joinUrl') joinUrlElement: ElementRef;

  readonly status$ = this.store.pipe(select(fromRoot.getStatus));
  readonly account$ = this.store.pipe(select(fromRoot.getAccount));
  readonly kudosTokenInfo$ = this.activatedRoute.params.pipe(
    mergeMap(({tokenAddress}) => this.getKudosTokenInfo(tokenAddress)),
    shareReplay());

  readonly adminJoinUrl$ = observableCombineLatest(
      this.joinName$.pipe(startWith(undefined)),
      this.store.pipe(select(fromRoot.getAccount)),
      this.activatedRoute.params,
    ).pipe(
      map(([name, account, {tokenAddress}]) =>
        `https://eth-kudos.com/${tokenAddress}/admin;address=${account}` + (name ? `;name=${name}` : ''),
      ),
      map(url => encodeURI(url)),
      distinctUntilChanged(),
      shareReplay());

  constructor(
    private store: Store<fromRoot.State>,
    private activatedRoute: ActivatedRoute,
  ) { }

  copyJoinUrl() {
    this.copied = true;
    this.joinUrlElement.nativeElement.select();
    document.execCommand('copy');
    setTimeout(() => this.copied = false, 2000);
  }

  private getKudosTokenInfo(address: string) {
    this.store.dispatch(new kudosTokenActions.LoadBasicDataAction(address));
    this.store.dispatch(new kudosTokenActions.LoadTotalDataAction(address));
    return this.store.pipe(select(fromRoot.getKudosTokenByAddressWithAccountData(address)));
  }
}
