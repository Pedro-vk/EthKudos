import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { Web3Service, ConnectionStatus } from './web3.service';

@Injectable()
export class IsConnectedGuard implements CanActivate, CanActivateChild {

  constructor(private web3Service: Web3Service, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.web3Service
      .status$
      .first()
      .map(status => {
        const connected = this.web3Service.status === ConnectionStatus.Total;
        if (!connected) {
          this.router.navigate(['/error', status]);
        }
        return connected;
      });
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }
}
