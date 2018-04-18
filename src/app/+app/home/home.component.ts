import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';

import { KudosTokenFactoryService, KudosPollService } from '../../shared';

@Component({
  selector: 'eth-kudos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());
  readonly imOwner$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.imOwner()));
  readonly imMember$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.imMember()));
  readonly getBalances$ = this.kudosTokenService$
    .mergeMap(kudosTokenService =>
      kudosTokenService
        .checkUpdates(_ => _.getBalances())
        .map(balances => balances.sort((a, b) => b.balance - a.balance))
        .map(balances => balances.map(async _ => ({..._, balance: await kudosTokenService.fromInt(_.balance)})))
        .mergeMap(_ => Observable.fromPromise(Promise.all(_))),
    );
  readonly getActivePollContract$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getActivePollContract()))
    .shareReplay();
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
  readonly getPreviousPollsContracts$ = this.kudosTokenService$.mergeMap(s => s.checkUpdates(_ => _.getPreviousPollsContracts()))
    .map(list =>
      list
        .map((kudosPollService, i) =>
          kudosPollService
            .checkUpdates(async _ => ({
              creation: await _.creation() * 1000,
              kudos: await _.fromInt(await _.myKudos()),
            }))
            .map(({creation, kudos}) => ({
              i,
              address: kudosPollService.address,
              creation,
              kudos: kudos,
            })),
        ),
    )
    .mergeMap(list => Observable.combineLatest(list))
    .map(_ => _.reverse());

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private activatedRoute: ActivatedRoute) { }

  trackContracts(index: number, contract: KudosPollService): string {
    return contract.address;
  }
  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }
}
