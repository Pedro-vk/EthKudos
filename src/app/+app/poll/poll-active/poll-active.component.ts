import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

@Component({
  selector: 'eth-kudos-poll-active',
  templateUrl: './poll-active.component.html',
  styleUrls: ['./poll-active.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollActiveComponent implements OnInit {
  tokenDecimals: number = 0;
  tokenStep: number = 0;
  reward: {member: string, kudos: number, message: string, working: boolean} = <any>{};

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
      .catch(() => Observable.empty<any>())
      .subscribe(({decimals}) => {
        this.tokenDecimals = decimals;
        this.tokenStep = 10 ** -decimals;
      });
  }

  setRewardKudos(inputNumber: {value: number}) {
    const cleanNumber = +(+inputNumber.value || 0).toFixed(this.tokenDecimals);
    if (this.reward.kudos !== cleanNumber || cleanNumber !== +inputNumber.value) {
      this.reward.kudos = cleanNumber;
      inputNumber.value = cleanNumber;
    }
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
