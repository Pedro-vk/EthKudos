import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

import { Web3Service, KudosTokenService } from '../../shared';

@Component({
  selector: 'eth-kudos-poll-active',
  templateUrl: './poll-active.component.html',
  styleUrls: ['./poll-active.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollActiveComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};
  reward: {member: string, kudos: number, message: string, working: boolean} = <any>{};

  readonly imMember$ = this.kudosTokenService.checkUpdates(_ => _.imMember());
  readonly getActivePollContract$ = this.kudosTokenService.checkUpdates(_ => _.getActivePollContract())
    .shareReplay(1);
  readonly getActivePollMembersNumber$ = this.getActivePollContract$
    .filter(_ => !!_)
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.membersNumber()))
    .share();
  readonly getActivePollRemainingKudos$ = this.getActivePollContract$
    .filter(_ => !!_)
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(async _ => {
      return await _.fromInt(await _.remainingKudos());
    }))
    .share();
  readonly getActivePollCreation$ = this.getActivePollContract$
    .filter(_ => !!_)
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.creation()))
    .share();
  readonly maxKudosToSend$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(async _ => ({
      remaining: await _.fromInt(await _.remainingKudos()),
      maxKudos: await _.fromInt(await _.maxKudosToMember()),
    })))
    .map(({remaining, maxKudos}) => Math.min(remaining, maxKudos))
    .share();
  readonly getOtherMembers$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.getMembers()))
    .map(members => this.kudosTokenService.getContactsOf(members))
    .mergeMap(_ => Observable.fromPromise(_))
    .combineLatest(this.web3Service.account$)
    .map(([contacts, account]) => contacts.filter(_ => (_.member || '').toLowerCase() !== (account || '').toLowerCase()))
    .share();

  constructor(private web3Service: Web3Service, private kudosTokenService: KudosTokenService, private router: Router) { }

  ngOnInit() {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
      });
    this.getActivePollContract$
      .filter(_ => !_)
      .first()
      .subscribe(() => this.router.navigate(['/']));
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }

  sendReward(form?: NgForm) {
    const done = (success?) => this.onActionFinished(success, this.reward, _ => this.reward = _, form);

    this.reward.working = true;
    this.getActivePollContract$
      .first()
      .subscribe(async kudosPollService => {
        kudosPollService
          .reward(
            this.reward.member,
            await kudosPollService.fromDecimals(this.reward.kudos),
            this.reward.message,
          )
          .then(() => done(true))
          .catch(() => done());
      });
  }

  private onActionFinished<T>(success: boolean, obj: T, setter: (d: T) => void, form: NgForm): void {
    if (success) {
      if (form) {
        setter(<any>{});
        form.reset();
      }
    } else {
      setter({...<any>obj, working: undefined});
    }
  }

}
