import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
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

import { Web3Service, KudosTokenFactoryService } from '../shared';

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
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());
  readonly isActivePoll$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.isActivePoll()));
  readonly getContacts$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getContacts()));

  readonly activePollContract$ = this.web3Service.changes$
    .startWith(undefined)
    .mergeMap(() => this.kudosTokenService$.mergeMap(s => Observable.fromPromise(s.getActivePollContract())));
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

  constructor(
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
          .checkUpdates(_ => _.imOnwer())
          .filter(imOnwer => !imOnwer)
          .first()
          .subscribe(() => this.router.navigate(['../'], {relativeTo: this.activatedRoute}));
      });

    this.getContacts$
      .subscribe(contacts => {
        contacts.forEach(({member, name}) => this.memberName[member] = this.memberName[member] || name);
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
