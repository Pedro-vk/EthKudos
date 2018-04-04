import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

import { KudosTokenFactoryService } from './kudos-token-factory.service';

@Injectable()
export class IsPollGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const pollAddress = next.params.address;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService
      .onInitialized
      .first()
      .mergeMap(() => Observable.fromPromise(kudosTokenService.getPreviousPolls()))
      .map(polls => polls.indexOf(pollAddress) !== -1)
      .do(imOwner => {
        if (!imOwner) {
          this.router.navigate([state.url.split('/').slice(0, -2).join('/')]);
        }
      });
  }
}
