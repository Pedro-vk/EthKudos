import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KudosTokenService } from '../../shared';

@Component({
  selector: 'eth-kudos-poll-active',
  templateUrl: './poll-active.component.html',
  styleUrls: ['./poll-active.component.scss']
})
export class PollActiveComponent implements OnInit {
  token: {name: string, symbol: string} = <any>{};

  readonly getActivePollContract$ = this.kudosTokenService.checkUpdates(_ => _.getActivePollContract())
    .shareReplay(1);
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
  readonly getActivePollCreation$ = this.getActivePollContract$
    .filter(_ => !!_)
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.creation()))
    .share();

  constructor(private kudosTokenService: KudosTokenService, private router: Router) { }

  ngOnInit() {
    this.kudosTokenService
      .onInitialized
      .subscribe(() => {
        this.setTokenInfo();
      });
    this.getActivePollContract$
      .filter(_ => !_)
      .first()
      .subscribe(() => this.router.navigate(['/']));
  }

  async setTokenInfo(): Promise<undefined> {
    this.token.name = await this.kudosTokenService.name();
    this.token.symbol = await this.kudosTokenService.symbol();
    return;
  }
}
