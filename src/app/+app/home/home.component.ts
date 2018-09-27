import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay, filter, map } from 'rxjs/operators';

import * as fromRoot from '../../shared/store/reducers';
import { AppCommonAbstract } from '../common.abstract';

@Component({
  selector: 'eth-kudos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppCommonAbstract {
  readonly kudosToken$ = this.store.pipe(
    select(fromRoot.getCurrentKudosTokenWithFullData),
    filter(_ => !!_ && !!_.address),
    shareReplay());
  readonly activePoll$ = this.kudosToken$.pipe(
    map(_ => _.activePoll),
    filter(_ => !!_ && !!_.address));
  readonly previousPolls$ = this.kudosToken$.pipe(
    map(_ => _.previousPolls || []));

  constructor(
    private store: Store<fromRoot.State>,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }
}
