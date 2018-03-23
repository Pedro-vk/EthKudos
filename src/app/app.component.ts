import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Web3Service, ConnectionStatus, KudosTokenService } from './shared';

@Component({
  selector: 'eth-kudos-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
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
  token: {name: string, symbol: string} = <any>{};

  readonly account$ = this.web3Service.account$;
  readonly balance$ = this.web3Service.checkUpdates(_ => _.getEthBalance());
  readonly kudosBalance$ = this.kudosTokenService.checkUpdates(async _ => _.fromInt(await _.myBalance()));
  readonly imOwner$ = this.kudosTokenService.checkUpdates(_ => _.imOnwer());
  readonly imMember$ = this.kudosTokenService.checkUpdates(_ => _.imMember());
  readonly myContact$ = this.kudosTokenService.checkUpdates(_ => _.myContact());

  get currentUrl(): string {
    return this.router.url;
  }

  constructor(private web3Service: Web3Service, private kudosTokenService: KudosTokenService, private router:Router) { }

  ngOnInit(): void {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
      });
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }
}
