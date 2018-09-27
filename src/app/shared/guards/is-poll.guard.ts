import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from as observableFrom, Observable } from 'rxjs';
import { tap, map, mergeMap, first } from 'rxjs/operators';

import { KudosTokenFactoryService } from '../kudos-token-factory.service';

@Injectable()
export class IsPollGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const pollAddress = next.params.address;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService.onInitialized.pipe(
      first(),
      mergeMap(() => observableFrom(kudosTokenService.getPreviousPolls())),
      map(polls => polls.indexOf(pollAddress) !== -1),
      tap(isPoll => {
        if (!isPoll) {
          this.router.navigate([state.url.split('/').slice(0, -2).join('/')]);
        }
      }));
  }
}
