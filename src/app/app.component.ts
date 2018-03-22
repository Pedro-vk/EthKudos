import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import 'rxjs/add/operator/delay';
import blockies from 'blockies';

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

  constructor(private domSanitizer: DomSanitizer, private web3Service: Web3Service, private kudosTokenService: KudosTokenService) { }

  ngOnInit(): void {
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .delay(200)
      .subscribe(() => {
        this.setTokenInfo();
      });
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }

  getImageOf(account: string = '#'): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(
      `url(${blockies({seed: account.toLowerCase(), size: 8, scale: 8}).toDataURL()})`,
    );
  }
}
