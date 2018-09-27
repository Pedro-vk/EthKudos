import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { EMPTY, combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { delay, catchError, first, filter, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';

import { GraphComponent } from '../../../components';
import { KudosTokenFactoryService, KudosPollFactoryService } from '../../../shared';
import * as fromRoot from '../../../shared/store/reducers';

import { AppCommonAbstract } from '../../common.abstract';

@Component({
  selector: 'eth-kudos-poll-chart',
  templateUrl: './poll-chart.component.html',
  styleUrls: ['./poll-chart.component.scss']
})
export class PollChartComponent extends AppCommonAbstract implements OnInit {
  loaded = false;
  @ViewChild('graph') graph: GraphComponent;
  @ViewChild('wrapper') wrapper: ElementRef;

  readonly kudosToken$ = this.store.pipe(
    select(fromRoot.getCurrentKudosTokenWithFullData),
    filter(_ => !!_),
    shareReplay());
  readonly kudosPoll$ = this.kudosToken$.pipe(
    map(({selectedPoll}) => selectedPoll),
    filter(_ => !!_));

  readonly gratitudesEdges$ = this.kudosPoll$.pipe(
    map(({allGratitudes}) => allGratitudes),
    map((gratitudes = []) => gratitudes.map(({from, to, kudos, message}) => [from, to, kudos, message])),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    filter(_ => !!_.length),
    shareReplay());
  readonly gratitudesNodes$ = observableCombineLatest(this.kudosPoll$, this.kudosToken$).pipe(
    map(([{members}, {contacts}]) =>
      (members || [])
        .map(member => ({
          id: member,
          name: contacts[member],
          address: member,
        }))
        .sort((a, b) => +a.address - +b.address)
        .map(data => ({data})),
    ),
    filter(_ => !!_.length),
    shareReplay());

  constructor(
    private store: Store<fromRoot.State>,
    protected changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    observableCombineLatest(this.gratitudesNodes$, this.gratitudesEdges$).pipe(
      first(),
      catchError(() => EMPTY),
      delay(10))
      .subscribe(() => {
        this.loaded = true;
        this.graph.ngOnInit();
        this.changeDetectorRef.markForCheck();
      });
  }

  @HostListener('window:resize')
  resize() {
    this.graph.cyResize();
  }

  setLayout(layout: string) {
    this.graph.setLayout(layout);
  }
}
