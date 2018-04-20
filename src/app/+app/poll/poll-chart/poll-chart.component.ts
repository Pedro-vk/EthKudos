import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

import { KudosTokenFactoryService, KudosPollFactoryService } from '../../../shared';
import { GraphComponent } from '../../../components';

@Component({
  selector: 'eth-kudos-poll-chart',
  templateUrl: './poll-chart.component.html',
  styleUrls: ['./poll-chart.component.scss']
})
export class PollChartComponent implements OnInit {
  @ViewChild('graph') graph: GraphComponent;
  @ViewChild('wrapper') wrapper: ElementRef;

  readonly kudosTokenService$ = this.activatedRoute.parent.params
    .map(({tokenAddress}) => this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress))
    .shareReplay();
  readonly token$ = this.kudosTokenService$.mergeMap(s => s.getTokenInfo());

  readonly pollContract$ = this.activatedRoute.params
    .filter(({address}) => !!address)
    .map(({address}) => this.kudosPollFactoryService.getKudosPollServiceAt(address))
    .mergeMap(kudosPollService => kudosPollService.onInitialized.startWith(undefined).map(() => kudosPollService))
    .shareReplay();
  readonly gratitudesEdges$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.allGratitudes()))
    .first()
    .combineLatest(this.kudosTokenService$)
    .first()
    .map(([gratitudes, kudosTokenService]) => gratitudes
      .map(async _ => ({
        ..._,
        kudos: await kudosTokenService.fromInt(_.kudos),
      })),
    )
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .map(gratitudes => gratitudes.map(({from, to, kudos, message}) => [from, to, kudos, message]))
    .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    .shareReplay();
  readonly gratitudesNodes$ = this.pollContract$
    .mergeMap(kudosPollService => kudosPollService.checkUpdates(_ => _.getMembers()))
    .first()
    .combineLatest(this.kudosTokenService$)
    .map(([members, kudosTokenService]) =>
      members.map(async member => ({member, name: await kudosTokenService.getContact(member)})),
    )
    .mergeMap(_ => Observable.fromPromise(Promise.all(_)))
    .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    .map(nodes =>
      nodes
        .map(({member, name}) => ({
          id: member,
          name,
          address: member,
        }))
        .sort((a, b) => +a.address - +b.address)
        .map(data => ({data})),
    );

  constructor(
    private activatedRoute: ActivatedRoute,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private kudosPollFactoryService: KudosPollFactoryService,
  ) { }

  ngOnInit() {
    this.gratitudesNodes$
      .combineLatest(this.gratitudesEdges$)
      .first()
      .delay(100)
      .subscribe(() => {
        this.graph.ngOnInit()
      });
  }

}
