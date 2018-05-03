import { Component, OnInit, ChangeDetectionStrategy, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

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
  readonly hasUpdates$ = this.serviceWorkerService.onUpdate.map(() => true);

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
      .mergeMap(account =>
        this.web3Service.getEthBalance()
          .filter(balance => balance <= 1)
          .map(() => account),
      )
      .subscribe(account => {
        this.claimTestEtherOnRopsten(account);
      });

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);

          this.setTitleByUrl(event.urlAfterRedirects)
            .then(() => {
              if (environment.production && (<any>window).ga) {
                (<any>window).ga('set', 'page', event.urlAfterRedirects);
                (<any>window).ga('send', 'pageview');
              }
            });
        }
      });

    const loading = document.getElementById('loading-wrapper');
    loading.parentNode.removeChild(loading);
  }

  async setTitleByUrl(url: string) {
    const segmenets = [...url.split('/').slice(1), undefined, undefined, undefined];
    const base = 'EthKudos - ';
    const title = <string>await (async () => {
      switch (true) {
        case !!segmenets[0].match(/^0x[0-9a-fA-F]{40}$/): {
          const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(segmenets[0]);
          const orgName = await kudosTokenService.onIsValid
            .mergeMap(() => Observable.fromPromise(kudosTokenService.name()))
            .first()
            .catch(() => Observable.empty())
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
