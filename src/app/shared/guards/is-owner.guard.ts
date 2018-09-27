import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from as observableFrom, Observable } from 'rxjs';
import { tap, mergeMap, first } from 'rxjs/operators';

import { KudosTokenFactoryService } from '../kudos-token-factory.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService.onInitialized.pipe(
      first(),
      mergeMap(() => observableFrom(kudosTokenService.imOwner())),
      tap(imOwner => {
        if (!imOwner) {
          this.router.navigate([state.url.split('/').slice(0, -1).join('/')]);
        }
      }));
  }
}
