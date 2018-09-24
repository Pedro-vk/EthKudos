import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';

import * as fromRoot from '../../shared/store/reducers';
import { AppCommonAbstract } from '../common.abstract';

@Component({
  selector: 'eth-kudos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppCommonAbstract {
  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData)
    .filter(_ => !!_ && !!_.address)
    .shareReplay();
  readonly activePoll$ = this.kudosToken$
    .map(_ => _.activePoll)
    .filter(_ => !!_ && !!_.address);
  readonly previousPolls$ = this.kudosToken$
    .map(_ => _.previousPolls || []);

  constructor(
    private store: Store<fromRoot.State>,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }
}
