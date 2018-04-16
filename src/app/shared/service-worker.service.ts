import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/shareReplay';

import { environment } from '../../environments/environment';

@Injectable()
export class ServiceWorkerService {
  private readonly _onUpdate = new Subject();
  readonly onUpdate = this._onUpdate.asObservable().shareReplay();

  constructor() {
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker.register('/ngsw-worker.js');

      navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (navigator.serviceWorker.controller !== null) {
          navigator.serviceWorker.controller.postMessage({action: 'INITIALIZE'});
        }
      });
      navigator.serviceWorker.onmessage = (message) => {
        if (message.data.type === 'UPDATE_AVAILABLE') {
          this._onUpdate.next();
        }
      };

      this.initCheckForUpdates();
    }
  }

  initCheckForUpdates() {
    setInterval(() => this.checkForUpdates(), 60 * 1000);
  }

  async checkForUpdates() {
    if (navigator.serviceWorker.controller !== null) {
      const statusNonce = Math.round(Math.random() * 10 ** 8);
      navigator.serviceWorker.controller.postMessage({action: 'CHECK_FOR_UPDATES', statusNonce});
    }
  }
}
