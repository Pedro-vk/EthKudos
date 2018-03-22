import { Component } from '@angular/core';

import { Web3Service, ConnectionStatus, KudosTokenService } from './shared';

@Component({
  selector: 'eth-kudos-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  token: {name: string, symbol: string} = <any>{};

  readonly account$ = this.web3Service.account$;
  readonly balance$ = this.web3Service.checkUpdates(_ => _.getEthBalance());
  readonly kudosBalance$ = this.kudosTokenService.checkUpdates(_ => _.myBalance());
  readonly imMember$ = this.kudosTokenService.checkUpdates(_ => _.imMember());
  readonly myContact$ = this.kudosTokenService.checkUpdates(_ => _.myContact());

  constructor(private web3Service: Web3Service, private kudosTokenService: KudosTokenService) { }

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
