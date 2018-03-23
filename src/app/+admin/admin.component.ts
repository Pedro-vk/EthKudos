import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

import { Web3Service, KudosTokenService } from '../shared';

@Component({
  selector: 'eth-kudos-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};
  newPoll: {kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number} = <any>{};

  readonly isActivePoll$ = this.kudosTokenService.checkUpdates(_ => _.isActivePoll());

  readonly activePollContract$ = this.web3Service.changes$
    .startWith(undefined)
    .mergeMap(() => Observable.fromPromise(this.kudosTokenService.getActivePollContract()));
  readonly activePollCanBeClosed$ = this.activePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.canBeClosed()))
    .catch(() => Observable.of(false))
    .distinctUntilChanged()
    .share();
  readonly kudosSentOnActivePoll$ = this.activePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(async _ => {
      const totalSupply = await _.totalSupply();
      const kudosByMember = await _.kudosByMember();
      const members = (await _.getMembers()).length;

      const initialTotal = kudosByMember * members;
      return await _.fromInt(initialTotal - totalSupply);
    }))
    .catch(() => Observable.of(0))
    .distinctUntilChanged()
    .share();
  readonly totalSupplyOnActivePoll$ = this.activePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(async _ => {
      return await _.fromInt(await _.totalSupply());
    }))
    .share();
  readonly percentageKudosSentOnActivePoll$ = Observable
    .combineLatest(this.kudosSentOnActivePoll$, this.totalSupplyOnActivePoll$)
    .map(([sent, remaining]) => sent / (sent + remaining))
    .share();

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

  isGoingToFinishOn(minutes: number): number {
    const min = 60 * 1000;
    return Math.round(Date.now() / min) * min + (minutes * min);
  }

  async createPoll() {
    this.kudosTokenService.newPoll(
      await this.kudosTokenService.fromDecimals(this.newPoll.kudosByMember),
      await this.kudosTokenService.fromDecimals(this.newPoll.maxKudosToMember),
      this.newPoll.minDurationInMinutes,
    );
  }

  closePoll() {
    this.kudosTokenService.closePoll();
  }
}
