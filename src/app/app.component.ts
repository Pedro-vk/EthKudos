import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Web3Service, ConnectionStatus, KudosTokenService } from './shared';

@Component({
  selector: 'eth-kudos-root',
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
  token: {name: string, symbol: string} = <any>{};
  clickedInstallMetaMask: boolean;

  readonly status$ = this.web3Service.status$;
  readonly account$ = this.web3Service.account$;
  readonly pendingTransactions$ = this.web3Service.pendingTransactions$;
  readonly balance$ = this.web3Service.checkUpdates(_ => _.getEthBalance());
  readonly kudosBalance$ = this.kudosTokenService.checkUpdates(async _ => _.fromInt(await _.myBalance()));
  readonly imOwner$ = this.kudosTokenService.checkUpdates(_ => _.imOnwer());
  readonly imMember$ = this.kudosTokenService.checkUpdates(_ => _.imMember());
  readonly myContact$ = this.kudosTokenService.checkUpdates(_ => _.myContact());

  get currentUrl(): string {
    return this.router.url;
  }

  constructor(
    private web3Service: Web3Service,
    private kudosTokenService: KudosTokenService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
      });

    this.web3Service.account$
      .mergeMap(account =>
        this.web3Service.getEthBalance()
          .filter(balance => balance <= 1)
          .map(() => account),
      )
      .subscribe(account => {
        this.claimTestEtherOnRopsten(account);
      });
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }

  claimTestEtherOnRopsten(account: string): void {
    console.log('Claim -> ', account);
    this.http.post('https://faucet.metamask.io', account)
      .subscribe(() => console.log('Claim done!'));
  }

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

  reload(): void {
    window.location.reload();
  }

  trackTransaction(index: string, transaction: {hash: string}): string {
    return transaction.hash || undefined;
  }
}
