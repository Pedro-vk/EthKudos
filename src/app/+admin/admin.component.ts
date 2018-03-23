import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { Web3Service, KudosTokenService } from '../shared';

@Component({
  selector: 'eth-kudos-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};
  newPoll: {kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number, working: boolean} = <any>{};
  closePollWorking: boolean;
  newMember: {member: string, contact: string, working: boolean} = <any>{};

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
    .map(([sent, remaining]) => (sent || 0) / ((sent || 0) + (remaining || 0)))
    .share();
  readonly activePollMinDeadline$ = this.activePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.minDeadline()))
    .map(_ => _ * 1000)
    .catch(() => Observable.empty())
    .distinctUntilChanged()
    .share();

  constructor(private web3Service: Web3Service, private kudosTokenService: KudosTokenService, private router: Router) { }

  ngOnInit(): void {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
        this.kudosTokenService
          .checkUpdates(_ => _.imOnwer())
          .filter(imOnwer => !imOnwer)
          .first()
          .subscribe(() => this.router.navigate(['/']));
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
    const done = () => {
      this.newPoll.working = false;
    };
    this.newPoll.working = true;
    this.kudosTokenService
      .newPoll(
        await this.kudosTokenService.fromDecimals(this.newPoll.kudosByMember),
        await this.kudosTokenService.fromDecimals(this.newPoll.maxKudosToMember),
        this.newPoll.minDurationInMinutes,
      )
      .then(() => done)
      .catch(() => done);
  }

  closePoll() {
    const done = () => {
      this.closePollWorking = false;
    };
    this.closePollWorking = true;
    this.kudosTokenService.closePoll()
      .then(() => done)
      .catch(() => done);
  }
  }
}
