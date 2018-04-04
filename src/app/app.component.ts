import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Web3Service, ConnectionStatus, KudosTokenFactoryService } from './shared';

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
export class AppComponent {
  clickedInstallMetaMask: boolean;

  readonly status$ = this.web3Service.status$;
  readonly account$ = this.web3Service.account$;
  readonly pendingTransactions$ = this.web3Service.pendingTransactions$;
  readonly balance$ = this.web3Service.checkUpdates(_ => _.getEthBalance());

  readonly kudosTokenService$ = this.activatedRoute.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());
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
  ) { }

  goToEtherscan(tx: string): void {
    const network = this.web3Service.networkType;
    let url;

    switch (network) {
      case 'main':
        url = `https://etherscan.io/tx/${tx}`;
        break;
      case 'ropsten':
      case 'rinkeby':
      case 'kovan':
        url = `https://${network}.etherscan.io/tx/${tx}`;
        break;
      default: break;
    }
    if (url) {
      const etherscan = window.open(url, '_blank');
      etherscan.focus();
    }
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
