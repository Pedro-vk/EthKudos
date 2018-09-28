import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';

import { KudosTokenFactoryService } from '../../../shared';
import * as fromRoot from '../../../shared/store/reducers';

import { AppCommonAbstract } from '../../common.abstract';

type suggestedReward = 'custom' | 1 | .5 | .25 | .1;

@Component({
  selector: 'eth-kudos-poll-active',
  templateUrl: './poll-active.component.html',
  styleUrls: ['./poll-active.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollActiveComponent extends AppCommonAbstract implements OnInit {
  tokenDecimals = 0;
  tokenStep = 0;
  maxKudosInput: number;
  maxKudos: number;
  reward: {member: string, kudos: number, message: string, working: boolean} = <any>{};
  suggested: suggestedReward = 'custom';
  @ViewChild('rewardInput') rewardInput: ElementRef;

  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .filter(({tokenAddress}) => !!tokenAddress)
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay()
    .filter(_ => !!_);
  readonly getActivePollContract$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getActivePollContract()))
    .filter(_ => !!_)
    .shareReplay();

  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData)
    .filter(_ => !!_)
    .shareReplay();
  readonly activePoll$ = this.kudosToken$
    .map(_ => _.activePoll)
    .filter(_ => !!_ && _.loaded && _.loaded.basic);

  readonly getOtherMembers$ = this.activePoll$
    .combineLatest(this.kudosToken$, this.store.select(fromRoot.getAccount).distinctUntilChanged())
    .map(([kudosPoll, kudosToken, account]) =>
      kudosPoll.members
        .filter(member => member !== account)
        .map((member) => ({member, name: kudosToken.contacts[member]})),
    );
  readonly myGratitudesSent$ = this.activePoll$
    .combineLatest(this.store.select(fromRoot.getAccount).distinctUntilChanged())
    .map(([kudosPoll, account]) =>
      kudosPoll.allGratitudes
        .filter(({from}) => from === account)
        .map(gratitude => ({...gratitude, kudos: gratitude.kudos})),
    );

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.kudosToken$
      .filter(({decimals}) => !isNaN(decimals))
      .first()
      .subscribe(({decimals}) => {
        this.tokenDecimals = decimals;
        this.tokenStep = 10 ** -decimals;
      });
    this.activePoll$
      .filter(({maxKudosToMember}) => !isNaN(maxKudosToMember))
      .subscribe(({maxKudosToMember, myBalance}) => {
        this.maxKudos = maxKudosToMember;
        this.maxKudosInput = Math.min(maxKudosToMember, myBalance);
      });
  }

  setRewardKudos(inputNumber: {value: number}, value?: number) {
    const cleanNumber = +(+value || +inputNumber.value || 0).toFixed(this.tokenDecimals);
    let number = cleanNumber;
    if (number <= 0) {
      number = this.tokenStep;
    }
    if (number > this.maxKudosInput) {
      number = this.maxKudosInput;
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
              setTimeout(() => {
                done(true);
                this.suggested = 'custom';
              }, 2000);
            }
            if (status === 'error') {
              done();
            }
          });
      });
  }
}
