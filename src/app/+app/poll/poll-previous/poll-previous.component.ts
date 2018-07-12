import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

import { KudosTokenFactoryService, KudosPollFactoryService } from '../../../shared';

@Component({
  selector: 'eth-kudos-poll-previous',
  templateUrl: './poll-previous.component.html',
  styleUrls: ['./poll-previous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollPreviousComponent {
  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());

  readonly pollContract$ = this.activatedRoute.params
    .filter(({address}) => !!address)
    .map(({address}) => this.kudosPollFactoryService.getKudosPollServiceAt(address))
    .mergeMap(kudosPollService => kudosPollService.onInitialized.startWith(undefined).map(() => kudosPollService))
    .shareReplay();
  readonly pollContractMembersNumber$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.membersNumber()))
    .shareReplay();
  readonly pollContractCreation$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.creation()))
    .shareReplay();
  readonly pollContractMyGratitudes$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.myGratitudes()))
    .combineLatest(this.kudosTokenService$)
    .map(([gratitudes, kudosTokenService]) => gratitudes
      .map(async _ => ({
        ..._,
        kudos: await kudosTokenService.fromInt(_.kudos),
        fromName: await kudosTokenService.getContact(_.from),
      }))
    )
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .shareReplay();
  readonly pollContractGrastitudesNumberByMember$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.gratitudesNumberByMember()));
  readonly pollContractResults$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.getPollResults()))
    .map(results => results.sort((a, b) => b.kudos - a.kudos))
    .combineLatest(
      this.kudosTokenService$,
      this.pollContractGrastitudesNumberByMember$
        .first()
        .catch(() => Observable.empty())
        .startWith(undefined),
    )
    .map(([results, kudosTokenService, gratitudesNumber]) => results.map(async _ => ({
      ..._,
      name: await kudosTokenService.getContact(_.member),
      kudos: await kudosTokenService.fromInt(_.kudos),
      gratitudesReceived: gratitudesNumber ? gratitudesNumber.received[_.member] || 0 : undefined,
      gratitudesSent: gratitudesNumber ? gratitudesNumber.sent[_.member] || 0 : undefined,
    })))
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .map(balances => {
      const maxGratitudesSent = Math.max(...balances.map(_ => _.gratitudesSent));
      const topSenders = 0.8;
      return balances
        .map(balance => ({
          ...balance,
          achievements: {
            topSender: balance.gratitudesSent === maxGratitudesSent,
            onTop: (balance.gratitudesSent > (maxGratitudesSent * topSenders)),
            noParticipation: balance.gratitudesSent === 0,
          },
        }));
    })
    .shareReplay();

  constructor(
    public activatedRoute: ActivatedRoute,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private kudosPollFactoryService: KudosPollFactoryService,
  ) { }

  trackGratitude(index: string): string {
    return `${index}` || undefined;
  }
  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }
}
