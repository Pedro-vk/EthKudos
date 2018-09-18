import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';

import { Web3Service, ConnectionStatus, KudosTokenFactoryService } from '../shared';
import { ShareDialogComponent } from '../components';

import * as fromRoot from '../shared/store/reducers';

@Component({
  selector: 'eth-kudos-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('.3s ease-in-out', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('.3s ease-in-out', style({opacity: 0})),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  clickedInstallMetaMask: boolean;

  readonly canBeShared: boolean = !!(navigator as any).share;

  readonly status$ = this.store.select(fromRoot.getStatus);
  readonly account$ = this.store.select(fromRoot.getAccount);
  readonly pendingTransactions$ = this.store.select(fromRoot.getPendingTransactions);
  readonly balance$ = this.store.select(fromRoot.getBalance);

  readonly kudosTokenService$ = this.activatedRoute.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData);

  constructor(
    private store: Store<fromRoot.State>,
    private web3Service: Web3Service,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.kudosTokenService$
      .mergeMap(kudosTokenService => kudosTokenService.onInitialized.map(() => kudosTokenService))
      .subscribe(kudosTokenService => {
        if (localStorage && kudosTokenService.address) {
          localStorage.setItem('kudos-address', kudosTokenService.address);
        }
      });
  }

  goToEtherscan(tx: string): void {
    this.web3Service.goToEtherscan(tx);
  }

  openShareDialog() {
    this.activatedRoute.params
      .subscribe(({tokenAddress}) => this.matDialog.open(ShareDialogComponent, {data: tokenAddress}));
  }

  share() {
    if ((navigator as any).share) {
      this.openShareDialog();
      return;
    }
    this.kudosTokenService$
      .mergeMap(kudosTokenService => kudosTokenService.onInitialized.map(() => kudosTokenService))
      .map(async kudosTokenService => {
        (navigator as any)
          .share({
            title: `Join ${await kudosTokenService.name()}`,
            url: `{document.location.origin}/${kudosTokenService.address}`,
          })
          .then(() => {})
          .catch(() => {});
      })
      .subscribe(proimise => proimise.then(() => {}));
  }

  routeIs(url: string): boolean {
    return this.router.url.split('/').slice(2).join('/') === url.replace(/^\//, '');
  }

  trackTransaction(index: string, transaction: {hash: string}): string {
    return transaction.hash || undefined;
  }
}
