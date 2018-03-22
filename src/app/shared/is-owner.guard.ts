import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

import { KudosTokenService } from './kudos-token.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(private kudosTokenService: KudosTokenService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.kudosTokenService
      .onInitialized
      .mergeMap(() => Observable.fromPromise(this.kudosTokenService.imOnwer()));
  }
}
