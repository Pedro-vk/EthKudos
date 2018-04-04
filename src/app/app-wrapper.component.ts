import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Web3Service } from './shared';

@Component({
  selector: 'eth-kudos-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWrapperComponent implements OnInit {
  constructor(private web3Service: Web3Service, private http: HttpClient) { }

  ngOnInit(): void {
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

  claimTestEtherOnRopsten(account: string): void {
    console.log('Claim -> ', account);
    this.http.post('https://faucet.metamask.io', account)
      .subscribe(() => console.log('Claim done!'));
  }
}
