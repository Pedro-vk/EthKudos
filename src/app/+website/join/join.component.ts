import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

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

  readonly status$ = this.store.select(fromRoot.getStatus);
  readonly account$ = this.store.select(fromRoot.getAccount);
  readonly kudosTokenInfo$ = this.activatedRoute.params
    .mergeMap(({tokenAddress}) => this.getKudosTokenInfo(tokenAddress))
    .shareReplay();

  readonly adminJoinUrl$ = this.joinName$
    .startWith(undefined)
    .combineLatest(this.store.select(fromRoot.getAccount), this.activatedRoute.params)
    .map(([name, account, {tokenAddress}]) =>
      `https://eth-kudos.com/${tokenAddress}/admin;address=${account}` + (name ? `;name=${name}` : ''),
    )
    .map(url => encodeURI(url))
    .distinctUntilChanged()
    .shareReplay();

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
    return this.store.select(fromRoot.getKudosTokenByAddressWithAccountData(address));
  }
}
