import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { Web3Service, KudosOrganisationsService, KudosTokenFactoryService } from '../shared';

@Component({
  selector: 'eth-kudos-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  orgAddress: string;
  newOrgAddress: Subject<string> = new Subject();

  readonly organisations$ = this.kudosOrganisationsService.checkUpdates(_ => _.getOrganisations())
    .combineLatest(this.newOrgAddress.startWith(undefined))
    .map(([organisations, search]) =>
      !search ?
        [] :
        organisations
          .filter(_ => _.indexOf(search) === 0),
    );

  readonly selectedOrganisation$ = this.newOrgAddress
    .mergeMap(address => {
      if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
        return Observable.of(undefined);
      }
      const kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(address);
      const selectedKudosTokenService = kudosTokenService
        .onIsValid
        .filter(_ => _)
        .first()
        .mergeMap(() => this.web3Service.account$)
        .map(async () => ({
          address: kudosTokenService.address,
          name: await kudosTokenService.name(),
          symbol: await kudosTokenService.symbol(),
          decimals: await kudosTokenService.decimals(),
          imMember: await kudosTokenService.imMember(),
          myBalance: await kudosTokenService.myBalance() / (10 ** await kudosTokenService.decimals()),
        }))
        .mergeMap(_ => Observable.fromPromise(_))
        .catch(() => Observable.of(undefined));
      return Observable
        .merge(
          kudosTokenService.onIsValid.filter(_ => !_).map(() => undefined),
          selectedKudosTokenService,
        );
    })
    .distinctUntilChanged();


  constructor(
    private web3Service: Web3Service,
    private kudosOrganisationsService: KudosOrganisationsService,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }
}
