import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { from as observableFrom, of as observableOf, merge as observableMerge, Observable } from 'rxjs';
import { mergeMap, shareReplay, map, filter, takeWhile, first, startWith, delay } from 'rxjs/operators';

import { Web3Service, ConnectionStatus, KudosTokenFactoryService } from '../shared';
import { ShareDialogComponent } from '../components';

import * as fromRoot from '../shared/store/reducers';

@Component({
  selector: 'eth-kudos-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('.3s ease-in-out', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('.3s ease-in-out', style({opacity: 0})),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  readonly status$ = this.store.pipe(select(fromRoot.getStatus));
  readonly account$ = this.store.pipe(select(fromRoot.getAccount));
  readonly pendingTransactions$ = this.store.pipe(select(fromRoot.getPendingTransactions));
  readonly balance$ = this.store.pipe(select(fromRoot.getBalance));

  readonly kudosToken$ = this.store.pipe(
    select(fromRoot.getCurrentKudosTokenWithFullData),
    filter(_ => !!_),
    shareReplay());
  readonly loadingStatus$ = this.kudosToken$.pipe(
    filter(_ => !!_ && !!_.polls),
    map(({loaded, polls, activePoll}) => {
      const total = (loaded.pollsProgress.total * 2) + 3;
      const pollsSize = loaded.pollsProgress.total;
      const loadedPolls = loaded.pollsProgress.total - loaded.pollsProgress.pending;
      const fullLoadedPolls = loaded.pollsProgress.total - loaded.pollsProgress.pendingFull;
      const allPollsLoaded = loaded.pollsProgress.pending === 0;
      const allPollsFullLoaded = loaded.pollsProgress.pendingFull === 0;
      const activePollLoaded = !!(activePoll && activePoll.loaded && activePoll.loaded.basic) ? 1 : 0;
      return {
        value: (allPollsFullLoaded ? total : 1 + activePollLoaded + (allPollsLoaded ? pollsSize : 0)) / total * 100,
        buffer: (1 + activePollLoaded + (allPollsLoaded ? 1 : 0) + loadedPolls + fullLoadedPolls) / total * 100,
      };
    }),
    mergeMap(progress => {
      if (progress.value === 100) {
        return observableMerge(
          observableOf(progress),
          observableFrom([undefined, false]).pipe(delay(2000)),
        );
      }
      return observableOf(progress);
    }),
    takeWhile((_: any) => _ !== false),
    startWith(<any>true));

  constructor(
    private store: Store<fromRoot.State>,
    private web3Service: Web3Service,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.kudosToken$.pipe(
      first())
      .subscribe(kudosToken => {
        if (localStorage && kudosToken.address) {
          localStorage.setItem('kudos-address', kudosToken.address);
        }
      });
    this.status$.pipe(
      filter(_ => _ !== ConnectionStatus.Total),
      first())
      .subscribe(() => this.router.navigate(['/error', status]));
  }

  goToEtherscan(tx: string): void {
    this.web3Service.goToEtherscan(tx);
  }

  openShareDialog() {
    this.activatedRoute.params
      .subscribe(({tokenAddress}) => this.matDialog.open(ShareDialogComponent, {data: tokenAddress}));
  }

  share() {
    if ((navigator as any).share) {
      this.openShareDialog();
      return;
    }
    this.kudosToken$
      .subscribe(kudosToken => {
        (navigator as any)
          .share({
            title: `Join ${kudosToken.name}`,
            url: `{document.location.origin}/${kudosToken.address}`,
          })
          .then(() => {})
          .catch(() => {});
      });
  }

  routeIs(url: string): boolean {
    return this.router.url.split('/').slice(2).join('/') === url.replace(/^\//, '');
  }

  trackTransaction(index: string, transaction: {hash: string}): string {
    return transaction.hash || undefined;
  }
}
