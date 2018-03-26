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
}
