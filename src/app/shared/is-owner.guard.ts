import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

import { KudosTokenFactoryService } from './kudos-token-factory.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService
      .onInitialized
      .mergeMap(() => Observable.fromPromise(kudosTokenService.imOnwer()));
  }
}
