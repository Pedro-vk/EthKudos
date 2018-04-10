import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

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

  readonly status$ = this.web3Service.status$;
  readonly account$ = this.web3Service.account$;
  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly kudosTokenInfo$ = this.activatedRoute.params
    .mergeMap(({tokenAddress}) => this.getKudosTokenInfo(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());

  readonly adminJoinUrl$ = this.joinName$
    .startWith(undefined)
    .combineLatest(this.web3Service.account$, this.activatedRoute.params)
    .map(([name, account, {tokenAddress}]) =>
      `https://eth-kudos.com/${tokenAddress}/admin;address=${account}` + (name ? `;name=${name}` : ''),
    )
    .map(url => encodeURI(url))
    .shareReplay();

  constructor(
    private web3Service: Web3Service,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  copyJoinUrl() {
    this.copied = true;
    this.joinUrlElement.nativeElement.select();
    document.execCommand('copy');
    setTimeout(() => this.copied = false, 2000);
  }

  private getKudosTokenInfo(address: string) {
    const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(address);
    const selectedKudosTokenService = kudosTokenService
      .onIsValid
      .filter(_ => _)
      .first()
      .mergeMap(() => this.web3Service.account$)
      .map(async () => ({
        address: kudosTokenService.address,
        name: await kudosTokenService.name(),
        symbol: await kudosTokenService.symbol(),
        decimals: await kudosTokenService.decimals(),
        members: await kudosTokenService.getContacts(),
        imMember: await kudosTokenService.imMember(),
        myBalance: await kudosTokenService.myBalance() / (10 ** await kudosTokenService.decimals()),
      }))
      .mergeMap(_ => Observable.fromPromise(_))
      .catch(() => Observable.of(undefined));
    return Observable
      .merge(
        kudosTokenService.onIsValid.filter(_ => !_).map(() => undefined),
        selectedKudosTokenService,
      );
  }
}
