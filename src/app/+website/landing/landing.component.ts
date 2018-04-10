import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/startWith';

import {
  Web3Service, ConnectionStatus, KudosOrganisationsService, KudosTokenFactoryService, cardInOutAnimation,
} from '../../shared';

@Component({
  selector: 'eth-kudos-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    cardInOutAnimation,
    trigger('warning', [
      transition(':enter', [
        style({height: 0, padding: 0}),
        animate('.3s ease', style({height: '*', padding: '*'})),
      ]),
      transition(':leave', [
        style({height: '*', padding: '*'}),
        animate('.3s ease', style({height: 0, padding: 0})),
      ]),
    ]),
  ]
})
export class LandingComponent implements OnInit {
  orgAddress: string;
  showHelp: boolean;
  newOrg: {name: string, symbol: string, decimals: number, toDirectory: boolean, working: boolean} = <any>{};

  newKudosTokenAddress: Subject<string> = new Subject();
  newOrgAddress: Subject<string> = new Subject();

  readonly hasChild: boolean = !!this.activatedRoute.firstChild;

  readonly hasError$: Observable<ConnectionStatus> = this.activatedRoute.params
    .map(({errorMessage}) => errorMessage)
    .filter(_ => !!_)
    .shareReplay();

  readonly ranking: {name: string, member: string, balance: number}[] = [
    {balance: 21.75, name: 'Ifan Colon', member: 'RANDOM #####Ifan Colon#####'},
    {balance: 18.8, name: 'Phoenix Mclean', member: 'RANDOM #####Phoenix Mclean##### 1'},
    {balance: 16, name: 'Carlie Lim', member: 'RANDOM #####Carlie Lim##### 1'},
    {balance: 13.2, name: 'Luci Haynes', member: 'RANDOM #####Luci Haynes##### @892'},
    {balance: 12.25, name: 'Jaya Lovell', member: 'RANDOM #####Jaya Lovell#####'},
    {balance: 10, name: 'Larry Pineda', member: 'RANDOM #####Larry Pineda#####'},
    {balance: 6, name: 'Robbie Shepherd', member: 'RANDOM #####Robbie Shepherd##### 2'},
  ];

  readonly status$ = this.web3Service.status$;
  readonly organisations$ = this.kudosOrganisationsService.checkUpdates(_ => _.getOrganisations())
    .combineLatest(this.newOrgAddress.startWith(undefined))
    .map(([organisations, search]) =>
      !search ? [] :
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
    .mergeMap(address => this.getKudosTokenInfo(address))
    .distinctUntilChanged();
  readonly previousOrganisation$ = Observable.of(localStorage ? localStorage.getItem('kudos-address') : undefined)
    .filter(_ => !!_)
    .mergeMap(address => this.getKudosTokenInfo(address))
    .distinctUntilChanged();


  constructor(
    private web3Service: Web3Service,
    private kudosOrganisationsService: KudosOrganisationsService,
    private kudosTokenFactoryService: KudosTokenFactoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.web3Service.status$
      .subscribe(status => {
        if (status === ConnectionStatus.Total && this.router.url.match(/^\/error/)) {
          this.router.navigate(['/']);
        }
      });
  }

  getDecimals(n: number = 0): number {
    return n ? 1 / (2 ** n) : 0;
  }

  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
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
