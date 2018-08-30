import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';

import { KudosTokenFactoryService } from '../kudos-token-factory.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService
      .onInitialized
      .first()
      .mergeMap(() => Observable.fromPromise(kudosTokenService.imOwner()))
      .do(imOwner => {
        if (!imOwner) {
          this.router.navigate([state.url.split('/').slice(0, -1).join('/')]);
        }
      });
  }
}
