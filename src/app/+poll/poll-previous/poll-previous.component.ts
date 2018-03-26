import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { KudosTokenService, KudosPollFactoryService } from '../../shared'

@Component({
  selector: 'eth-kudos-poll-previous',
  templateUrl: './poll-previous.component.html',
  styleUrls: ['./poll-previous.component.scss']
})
export class PollPreviousComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};

  readonly pollContract$ = this.route.paramMap
    .map((params: ParamMap) => params.get('address'))
    .map(address => this.kudosPollFactoryService.getKudosPollServiceAt(address))
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
    .map(gratitudes => gratitudes
      .map(async _ => ({
        ..._,
        kudos: await this.kudosTokenService.fromInt(_.kudos),
        fromName: await this.kudosTokenService.getContact(_.from),
      }))
    )
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .shareReplay();
  readonly pollContractResults$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.getPollResults()))
    .map(results => results.sort((a, b) => b.kudos - a.kudos))
    .map(results => results.map(async _ => ({
      ..._,
      name: await this.kudosTokenService.getContact(_.member),
      kudos: await this.kudosTokenService.fromInt(_.kudos),
    })))
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)));

  constructor(private route: ActivatedRoute, private kudosTokenService: KudosTokenService, private kudosPollFactoryService: KudosPollFactoryService) { }

  ngOnInit() {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
      });
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }

  trackGratitude(index: string): string {
    return `${index}` || undefined;
  }
}
