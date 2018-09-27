import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, first } from 'rxjs/operators';

import { KudosTokenFactoryService } from '../kudos-token-factory.service';

@Injectable()
export class IsTokenGuard implements CanActivate {

  constructor(private kudosTokenFactoryService: KudosTokenFactoryService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
    const kudosTokenService = this.kudosTokenFactoryService
      .getKudosTokenServiceAt(tokenAddress);
    return kudosTokenService.onIsValid.pipe(
      first(),
      tap(isValid => {
        if (!isValid) {
          this.router.navigate(['/']);
        }
      }));
  }
}
