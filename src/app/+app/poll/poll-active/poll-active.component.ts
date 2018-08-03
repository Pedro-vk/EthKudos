import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';

import { Web3Service, KudosTokenFactoryService } from '../../../shared';

type suggestedReward = 'custom' | 1 | .5 | .25 | .1;

@Component({
  selector: 'eth-kudos-poll-active',
  templateUrl: './poll-active.component.html',
  styleUrls: ['./poll-active.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollActiveComponent implements OnInit {
  tokenDecimals = 0;
  tokenStep = 0;
  reward: {member: string, kudos: number, message: string, working: boolean} = <any>{};
  maxKudos: number;
  suggested: suggestedReward = 'custom';
  @ViewChild('rewardInput') rewardInput: ElementRef;

  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .filter(({tokenAddress}) => !!tokenAddress)
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay()
    .filter(_ => !!_);
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());

  readonly imMember$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.imMember()));
  readonly getActivePollContract$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getActivePollContract()))
    .filter(_ => !!_)
    .shareReplay();
  readonly getActivePollMembersNumber$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.membersNumber()))
    .share();
  readonly getActivePollRemainingKudos$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(async _ => {
      return await _.fromInt(await _.remainingKudos());
    }))
    .share();
  readonly getActivePollCreation$ = this.getActivePollContract$
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
    .mergeMap(members => this.kudosTokenService$.map(s => s.getContactsOf(members)))
    .mergeMap(_ => Observable.fromPromise(_))
    .combineLatest(this.web3Service.account$)
    .map(([contacts, account]) => contacts.filter(_ => (_.member || '').toLowerCase() !== (account || '').toLowerCase()))
    .share();
  readonly myGratitudesSent$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.myGratitudesSent()))
    .combineLatest(this.kudosTokenService$)
    .map(([gratitudes, kudosTokenService]) => gratitudes
      .map(async _ => ({
        ..._,
        kudos: await kudosTokenService.fromInt(_.kudos),
        toName: await kudosTokenService.getContact(_.to),
      }))
    )
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .shareReplay();
  readonly canBeClosed$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.canBeClosed()))
    .share();
  readonly activePollRemaining$ = this.getActivePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.minDeadline()))
    .map(_ => _ * 1000)
    .catch(() => Observable.empty())
    .share();

  constructor(
    private web3Service: Web3Service,
    private router: Router,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getActivePollContract()))
      .filter(_ => !_)
      .first()
      .catch(() => Observable.empty())
      .subscribe(() => this.router.navigate(['/']));
    this.token$
      .first()
      .catch(() => Observable.empty())
      .subscribe(({decimals}) => {
        this.tokenDecimals = decimals;
        this.tokenStep = 10 ** -decimals;
      });
    this.maxKudosToSend$
      .subscribe(maxKudos => this.maxKudos = maxKudos);
  }

  setRewardKudos(inputNumber: {value: number}, value?: number) {
    const cleanNumber = +(+value || +inputNumber.value || 0).toFixed(this.tokenDecimals);
    let number = cleanNumber;
    if (number <= 0) {
      number = undefined;
    }
    if (number > this.maxKudos) {
      number = this.maxKudos;
    }
    if (this.reward.kudos !== number || number !== +inputNumber.value) {
      this.reward.kudos = number;
      inputNumber.value = number;
    }
    this.setRewardKudosType(+number);
  }

  setRewardKudosType(value: number) {
    const cleanNumber = +(+value || 0).toFixed(this.tokenDecimals);
    const percentage = cleanNumber / this.maxKudos;
    this.suggested = [1, .5, .25, .1].indexOf(percentage) !== -1 ? <suggestedReward>percentage : 'custom';
  }

  setSuggestedReward(reward: suggestedReward): void {
    if (reward === 'custom') {
      this.rewardInput.nativeElement.focus();
      return;
    }
    this.setRewardKudos(this.rewardInput.nativeElement, reward * this.maxKudos);
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
          .$observable
          .subscribe(status => {
            if (status === 'waiting') {
              setTimeout(() => done(true), 2000);
            }
            if (status === 'error') {
              done();
            }
          });
      });
  }

  trackGratitude(index: string): string {
    return `${index}` || undefined;
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
