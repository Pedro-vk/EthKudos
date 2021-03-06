import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';

import * as fromRoot from '../../../shared/store/reducers';

import { AppCommonAbstract } from '../../common.abstract';

@Component({
  selector: 'eth-kudos-poll-previous',
  templateUrl: './poll-previous.component.html',
  styleUrls: ['./poll-previous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollPreviousComponent extends AppCommonAbstract {
  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData)
    .filter(_ => !!_)
    .shareReplay();
  readonly kudosPoll$ = this.kudosToken$
    .map(({selectedPoll}) => selectedPoll);

  constructor(
    private store: Store<fromRoot.State>,
    public activatedRoute: ActivatedRoute,
  ) {
    super();
  }
}
