import { Component, OnInit, ChangeDetectionStrategy, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, GuardsCheckStart, GuardsCheckEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EMPTY, from as observableFrom, Observable } from 'rxjs';
import { catchError, map, scan, shareReplay, distinctUntilChanged, mergeMap, filter, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';

import { Web3Service, KudosTokenFactoryService, ServiceWorkerService } from './shared';

@Component({
  selector: 'eth-kudos-root',
  templateUrl: './app-wrapper.component.html',
  styleUrls: ['./app-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('updatesIn', [
      transition(':enter', [
        style({opacity: 0, bottom: '-40px'}),
        animate('.3s ease-in-out', style({opacity: 1, bottom: '*'})),
      ]),
    ]),
  ],
})
export class AppWrapperComponent implements OnInit {
  readonly hasUpdates$ = this.serviceWorkerService.onUpdate.pipe(map(() => true));
  readonly isRouterWaiting$ = this.router.events.pipe(
    scan((loading, event) => {
      if (loading && event instanceof GuardsCheckEnd) {
        return false;
      }
      if (!loading && event instanceof GuardsCheckStart) {
        return true;
      }
      return loading;
    }, <any>false),
    shareReplay(),
    distinctUntilChanged());

  constructor(
    private web3Service: Web3Service,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private serviceWorkerService: ServiceWorkerService,
    private translateService: TranslateService,
    private http: HttpClient,
    private router: Router,
    private title: Title,
    @Inject(LOCALE_ID) private localeId: string,
  ) {
    translateService.setDefaultLang('en');
    translateService.use(localeId);
  }

  ngOnInit(): void {
    this.web3Service.account$
      .pipe(mergeMap(account =>
        this.web3Service.getEthBalance().pipe(
          filter(balance => balance <= 1),
          map(() => account)),
      ))
      .subscribe(account => {
        this.claimTestEtherOnRopsten(account);
      });

    this.router.events
      .pipe(
        filter(event => event instanceof GuardsCheckEnd),
        first(),
      )
      .subscribe(() => {
        const loading = document.getElementById('loading-wrapper');
        loading.parentNode.removeChild(loading);
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.scrollTo(0, 0);
        this.setTitleByUrl(event.urlAfterRedirects)
          .then(() => {
            if (environment.production && (<any>window).ga) {
              (<any>window).ga('set', 'page', event.urlAfterRedirects);
              (<any>window).ga('send', 'pageview');
            }
          });
      });
  }

  async setTitleByUrl(url: string) {
    const segmenets = [...url.split('/').slice(1), undefined, undefined, undefined];
    const base = 'EthKudos - ';
    const title = <string>await (async () => {
      switch (true) {
        case !!segmenets[0].match(/^0x[0-9a-fA-F]{40}$/): {
          const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(segmenets[0]);
          const orgName = await kudosTokenService.onIsValid
            .pipe(
              mergeMap(() => observableFrom(kudosTokenService.name())),
              first(),
              catchError(() => EMPTY),
            )
            .toPromise();

          switch (true) {
            case segmenets[1] === 'faqs': return `${orgName} - FAQs`;
            case segmenets[1] === 'admin': return `${orgName} - Admin`;
            case segmenets[1] === 'active': return `${orgName} - Active polling`;
            case segmenets[1] === 'closed': {
              const pollingNumber = (await kudosTokenService.getPreviousPolls()).indexOf(segmenets[2]);
              return `${orgName} - Polling #${pollingNumber + 1}`;
            }
            default: return orgName;
          }
        }
        case segmenets[0] === 'faqs': return 'FAQs';
        case segmenets[0] === 'donate': return 'Donate';
        case segmenets[0] === 'privacy-policy': return 'Privacy Policy';
        default: return `Time to reward`;
      }
    })();

    this.title.setTitle(base + title);
  }

  claimTestEtherOnRopsten(account: string): void {
    console.log('Claim -> ', account);
    this.http.post('https://faucet.metamask.io', account, {responseType: 'text'})
      .subscribe(() => console.log('Claim done!'));
  }

  reload() {
    window.location.reload();
  }
}
