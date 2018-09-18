import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

import * as fromRoot from '../../shared/store/reducers';

import { Web3Service, KudosTokenFactoryService } from '../../shared';

@Component({
  selector: 'eth-kudos-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  newPoll: {kudosByMember: number, maxKudosToMember: number, minDurationInMinutes: number, working: boolean} = <any>{};
  closePollWorking: boolean;
  newMember: {member: string, contact: string, working: boolean} = <any>{};

  memberName: {[address: string]: string} = {};
  memberWorking: {[address: string]: boolean} = {};

  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData);

  readonly activePollContract$ = this.web3Service.changes$
    .startWith(undefined)
    .mergeMap(() => this.kudosTokenService$.mergeMap(s => Observable.fromPromise(s.getActivePollContract())))
    .filter(_ => !!_);
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
      return {
        sent: await _.fromInt(initialTotal - totalSupply),
        total: await _.fromInt(initialTotal),
      };
    }))
    .catch(() => Observable.of({sent: 0, total: 0}))
    .distinctUntilChanged()
    .share();
  readonly percentageKudosSentOnActivePoll$ = this.kudosSentOnActivePoll$
    .map(({sent, total}) => sent / total)
    .share();
  readonly activePollMinDeadline$ = this.activePollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.minDeadline()))
    .map(_ => _ * 1000)
    .catch(() => Observable.empty())
    .distinctUntilChanged()
    .share();

  constructor(
    private store: Store<fromRoot.State>,
    private web3Service: Web3Service,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.kudosTokenService$
      .subscribe(kudosTokenService => {
        kudosTokenService
          .checkUpdates(_ => _.imOwner())
          .filter(imOnwer => !imOnwer)
          .first()
          .subscribe(() => this.router.navigate(['../'], {relativeTo: this.activatedRoute}));
      });

    this.kudosToken$
      .filter(_ => !!_)
      .subscribe(({members}) => {
        members.forEach(({member, name}) => this.memberName[member] = this.memberName[member] || name);
      });

    this.activatedRoute.params
      .first()
      .catch(() => Observable.empty())
      .subscribe(({address, name}: any) => {
        if (address) {
          this.newMember.member = address;
        }
        if (name) {
          this.newMember.contact = name;
        }
        this.newMember = {...this.newMember};
      });
  }

  isGoingToFinishOn(minutes: number): number {
    const min = 60 * 1000;
    return Math.round(Date.now() / min) * min + (minutes * min);
  }

  createPoll(form?: NgForm) {
    const done = (success?) => this.onActionFinished(success, this.newPoll, _ => this.newPoll = _, form);

    this.newPoll.working = true;
    this.kudosTokenService$
      .first()
      .subscribe(async kudosTokenService => {
        kudosTokenService
          .newPoll(
            await kudosTokenService.fromDecimals(this.newPoll.kudosByMember),
            await kudosTokenService.fromDecimals(this.newPoll.maxKudosToMember),
            this.newPoll.minDurationInMinutes,
          )
          .then(() => done(true))
          .catch(err => console.warn(err) || done());
      });
  }

  closePoll() {
    const done = (success?: boolean) => {
      this.closePollWorking = undefined;
      this.changeDetectorRef.markForCheck();
    };
    this.closePollWorking = true;
    this.kudosTokenService$
      .first()
      .subscribe(kudosTokenService => {
        kudosTokenService
          .closePoll()
          .then(() => done(true))
          .catch(err => console.warn(err) || done());
      });
  }

  addMember(form?: NgForm) {
    const done = (success?) => this.onActionFinished(success, this.newMember, _ => this.newMember = _, form);

    this.newMember.working = true;
    this.kudosTokenService$
      .first()
      .subscribe(kudosTokenService => {
        kudosTokenService
          .addMember(
            this.newMember.member,
            this.newMember.contact,
          )
          .then(() => done(true))
          .catch(err => console.warn(err) || done());
      });
  }

  editContact(address: string, name: string) {
    const done = (success?: boolean) => {
      this.memberWorking[address] = undefined;
      this.changeDetectorRef.markForCheck();
    };
    this.memberWorking[address] = true;
    this.kudosTokenService$
      .first()
      .subscribe(kudosTokenService => {
        kudosTokenService
          .editContact(address, name)
          .then(() => done(true))
          .catch(err => console.warn(err) || done());
      });
  }

  removeMember(address: string) {
    const done = (success?: boolean) => {
      if (!success) {
        this.memberWorking[address] = undefined;
        this.changeDetectorRef.markForCheck();
      }
    };
    this.memberWorking[address] = true;
    this.kudosTokenService$
      .first()
      .subscribe(kudosTokenService => {
        kudosTokenService
          .removeMember(address)
          .then(() => done(true))
          .catch(err => console.warn(err) || done());
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
    this.changeDetectorRef.markForCheck();
  }

  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }
}
