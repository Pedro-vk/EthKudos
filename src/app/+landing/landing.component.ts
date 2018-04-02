import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
  animations: [
    trigger('cardInOut', [
      transition(':enter', [
        style({opacity: 0, top: '-40px', height: 0, 'padding-top': 0, 'padding-bottom': 0}),
        animate('.3s ease-in-out', style({opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*'})),
      ]),
      transition(':leave', [
        style({opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*'}),
        animate('.3s ease-in-out', style({opacity: 0, top: '40px', height: 0, 'padding-top': 0, 'padding-bottom': 0})),
      ])
    ]),
  ]
})
export class LandingComponent {
  orgAddress: string;
  newOrg: {name: string, symbol: string, decimals: number, toDirectory: boolean, working: boolean} = <any>{};

  newKudosTokenAddress: Subject<string> = new Subject();
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
      return this.getKudosTokenInfo(address);
    })
    .distinctUntilChanged();
  readonly newOrganisation$ = this.newKudosTokenAddress
    .mergeMap(address => {
      return this.getKudosTokenInfo(address);
    })
    .distinctUntilChanged();


  constructor(
    private web3Service: Web3Service,
    private kudosOrganisationsService: KudosOrganisationsService,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  getDecimals(n: number = 0): number {
    return n ? 1 / (2 ** n) : 0;
  }

  createOrganisation(form?: NgForm) {
    const done = (success?) => this.onActionFinished(success, this.newOrg, _ => this.newOrg = _, form);

    this.newOrg.working = true;
    this.kudosOrganisationsService
      .newOrganisation(
        this.newOrg.name,
        this.newOrg.symbol,
        this.newOrg.decimals || 0,
        this.newOrg.toDirectory || false,
      )
      .then((tx: any) => {
        const newKudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;
        this.newKudosTokenAddress.next(newKudosTokenAddress);
        done(true);
      })
      .catch(err => console.warn(err) || done());
  }

  private onActionFinished<T>(success: boolean, obj: T, setter: (d: T) => void, form: NgForm): void {
    if (success) {
      if (form) {
        setter(<any>{});
        form.reset();
        form.resetForm();
      }
    } else {
      setter({...<any>obj, working: undefined});
    }
    this.changeDetectorRef.markForCheck();
  }

  private getKudosTokenInfo(address: string) {
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
  }
}
