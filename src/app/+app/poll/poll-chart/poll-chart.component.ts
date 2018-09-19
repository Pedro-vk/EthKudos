import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';

import { GraphComponent } from '../../../components';
import { KudosTokenFactoryService, KudosPollFactoryService } from '../../../shared';
import * as fromRoot from '../../../shared/store/reducers';

@Component({
  selector: 'eth-kudos-poll-chart',
  templateUrl: './poll-chart.component.html',
  styleUrls: ['./poll-chart.component.scss']
})
export class PollChartComponent implements OnInit {
  loaded = false;
  @ViewChild('graph') graph: GraphComponent;
  @ViewChild('wrapper') wrapper: ElementRef;

  readonly kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithFullData)
    .filter(_ => !!_)
    .shareReplay();
  readonly kudosPoll$ = this.kudosToken$
    .map(({selectedPoll}) => selectedPoll)
    .filter(_ => !!_);

  readonly gratitudesEdges$ = this.kudosPoll$
    .map(({allGratitudes}) => allGratitudes)
    .map((gratitudes = []) => gratitudes.map(({from, to, kudos, message}) => [from, to, kudos, message]))
    .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    .filter(_ => !!_.length)
    .shareReplay();
  readonly gratitudesNodes$ = this.kudosPoll$
    .combineLatest(this.kudosToken$)
    .map(([{members}, {contacts}]) =>
      (members || [])
        .map(member => ({
          id: member,
          name: contacts[member],
          address: member,
        }))
        .sort((a, b) => +a.address - +b.address)
        .map(data => ({data})),
    )
    .filter(_ => !!_.length)
    .shareReplay();

  constructor(
    private store: Store<fromRoot.State>,
    public activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.gratitudesNodes$
      .combineLatest(this.gratitudesEdges$)
      .first()
      .catch(() => Observable.empty())
      .delay(10)
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
