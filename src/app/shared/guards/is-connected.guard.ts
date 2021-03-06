import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { Web3Service, ConnectionStatus } from '../web3.service';
import * as fromRoot from '../store/reducers';

@Injectable()
export class IsConnectedGuard implements CanActivate, CanActivateChild {

  constructor(private store: Store<fromRoot.State>, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(fromRoot.getStatus)
      .filter(_ => !!_)
      .first()
      .map(status => {
        const connected = status === ConnectionStatus.Total;
        if (!connected) {
          const {tokenAddress} = next.params;
          if (localStorage && tokenAddress && /^0x[a-f0-9]{40}$/i.test(tokenAddress)) {
            localStorage.setItem('kudos-address', tokenAddress);
          }
          this.router.navigate(['/error', status]);
        }
        return connected;
      });
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }
}
