import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';

import { Web3Service, ConnectionStatus, KudosTokenFactoryService } from '../shared';
import { ShareDialogComponent } from '../components';

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
      ])
    ]),
    trigger('buttonFade', [
      state('*', style({transform: 'scale(1)', width: '*', margin: '*'})),
      transition(':enter', [
        style({transform: 'scale(0)', width: 0, margin: 0}),
        animate('.26s ease'),
      ]),
      transition(':leave', [
        animate('.26s ease', style({transform: 'scale(0)', width: 0, margin: 0})),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  clickedInstallMetaMask: boolean;

  readonly canBeShared: boolean = !!(navigator as any).share;

  readonly status$ = this.web3Service.status$;
  readonly account$ = this.web3Service.account$;
  readonly pendingTransactions$ = this.web3Service.pendingTransactions$;
  readonly balance$ = this.web3Service.checkUpdates(_ => _.getEthBalance());

  readonly kudosTokenService$ = this.activatedRoute.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());
  readonly organisationName$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.organisationName()));
  readonly kudosBalance$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(async _ => _.fromInt(await _.myBalance())));
  readonly imOwner$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.imOnwer()));
  readonly imMember$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.imMember()));
  readonly myContact$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.myContact()));

  constructor(
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
    this.kudosTokenService$
      .mergeMap(kudosTokenService => kudosTokenService.onInitialized.map(() => kudosTokenService))
      .map(async kudosTokenService => {
        if ((navigator as any).share) {
          (navigator as any)
            .share({
              title: `Join ${await kudosTokenService.name()}`,
              url: `{document.location.origin}/${kudosTokenService.address}`,
            })
            .then(() => {})
            .catch(() => {});
        }
        return;
      })
      .subscribe(proimise => proimise.then(() => {}));
  }

  routeIs(url: string): boolean {
    return this.router.url.split('/').slice(2).join('/') === url.replace(/^\//, '');
  }

  reload(): void {
    window.location.reload();
  }

  trackTransaction(index: string, transaction: {hash: string}): string {
    return transaction.hash || undefined;
  }
}
