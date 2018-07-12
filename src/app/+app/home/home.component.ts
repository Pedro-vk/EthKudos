import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

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
        .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
        .combineLatest(
          Observable.fromPromise(kudosTokenService.getPreviousPollsContracts())
            .filter(polls => polls.length !== 0)
            .map(polls =>
              polls.map(async poll => await poll.gratitudesNumberByMember())
            )
            .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
            .map(gratitudesByPoll => {
              const mix = (a, b) => {
                return Object.keys({...a, ...b})
                  .filter((_, i, list) => list.indexOf(_) === i)
                  .reduce((acc, _) => ({
                    ...acc,
                    [_]: (a[_] || 0) + (b[_] || 0),
                  }), {});
              };
              const clean = obj => Object.keys(obj).reduce((acc, _) => ({...acc, [_]: 1}), {});
              return gratitudesByPoll
                .reduce<{received: any, sent: any, poll: any}>((acc, _) => ({
                  received: mix(acc.received, _.received),
                  sent: mix(acc.sent, _.sent),
                  poll: mix(acc.poll, clean(_.received)),
                }), {received: {}, sent: {}, poll: {}});
            })
            .startWith(undefined),
        )
        .map(([ranking, gratitudesNumber]) =>
          ranking
            .map(_ => ({
              ..._,
              gratitudesReceived: gratitudesNumber ? gratitudesNumber.received[_.member] || 0 : undefined,
              gratitudesSent: gratitudesNumber ? gratitudesNumber.sent[_.member] || 0 : undefined,
              entries: gratitudesNumber ? gratitudesNumber.poll[_.member] || 0 : undefined,
            })),
        ),
    )
    .map(balances => {
      const maxGratitudesSent = Math.max(...balances.map(_ => _.gratitudesSent));
      const topSenders = 0.8;
      return balances
        .map(balance => ({
          ...balance,
          achievements: {
            topSender: balance.entries && balance.gratitudesSent === maxGratitudesSent,
            onTop: balance.entries && (balance.gratitudesSent > (maxGratitudesSent * topSenders)),
            noParticipation: balance.entries && balance.gratitudesSent === 0,
            beginner: balance.entries === 0,
          },
        }));
    });
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
