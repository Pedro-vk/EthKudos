import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import Web3 from 'web3';
import * as Web3Module from 'web3';
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

  donationBalance: number;
  donationGoal: number;

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
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.web3Service.status$
      .subscribe(status => {
        if (status === ConnectionStatus.Total && this.router.url.match(/^\/error/)) {
          this.router.navigate(['/']);
        }
      });

    // Getting donation account balance
    this.donationGoal = 0.2;
    this.getBalance('0x178a262C6B2FFB042f5cb1A7a20d7edbDdb3B16D', 'G5GY5DRYQNX4SFJKNPQHHF3864VNKT29H3')
      .subscribe(balance => this.donationBalance = balance);
  }

  getDecimals(n: number = 0): number {
    return n ? 1 / (2 ** n) : 0;
  }

  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }

  getBalance(account: string, apiKey: string): Observable<number> {
    return Observable.interval(30 * 1000)
      .startWith(undefined)
      .mergeMap(() =>
        this.http
          .get<{result: string}>(
            `https://api.etherscan.io/api?module=account&action=balance&address=${account}&tag=latest&apikey=${apiKey}`,
          ),
      )
      .map(({result}) => +(<Web3><any>Web3Module).utils.fromWei(result, 'ether'));
  }

  getDonationProgress(): number {
    const dashoffset = 1099.56;
    if (!this.donationBalance) {
      return dashoffset;
    }
    return Math.min(dashoffset * (0.75 * (1 - Math.min(this.donationBalance / this.donationGoal, 1)) + 0.25), dashoffset * 0.98);
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
