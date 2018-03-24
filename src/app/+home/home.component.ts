import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { KudosTokenService } from '../shared';

@Component({
  selector: 'eth-kudos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};

  readonly getBalances$ = this.kudosTokenService
    .checkUpdates(_ => _.getBalances())
    .map(balances => balances.sort((a, b) => b.balance - a.balance))
    .map(balances => balances.map(async _ => ({..._, balance: await this.kudosTokenService.fromInt(_.balance)})))
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)));

  constructor(private kudosTokenService: KudosTokenService) { }

  ngOnInit() {
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

  trackMember(index: number, {member}: {member:string} & any): string {
    return member || undefined;
  }
}
