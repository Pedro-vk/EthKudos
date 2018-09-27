import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';

import { Web3Service, ConnectionStatus } from '../web3.service';
import * as fromRoot from '../store/reducers';

@Injectable()
export class IsConnectedGuard implements CanActivate, CanActivateChild {

  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(fromRoot.getStatus),
      filter(_ => !!_),
      first(),
      map(status => {
        const connected = status === ConnectionStatus.Total;
        if (!connected) {
          this.router.navigate(['/error', status]);
        }
        return connected;
      }));
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }
}
