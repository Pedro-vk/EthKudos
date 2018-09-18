import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { KudosTokenFactoryService, KudosPollService } from '../../shared';
import * as fromRoot from '../../shared/store/reducers';

@Component({
  selector: 'eth-kudos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData)
    .filter(_ => !!_);
  readonly activePoll$ = this.kudosToken$.map(_ => _.activePoll);
  readonly previousPolls$ = this.kudosToken$.map(_ => _.previousPolls || []);

  constructor(
    private store: Store<fromRoot.State>,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  trackPoll(index: number, contract: {address: string}): string {
    return contract.address;
  }
  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }
}
