import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppWrapperModule } from './app/app-wrapper.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppWrapperModule)
  .then(() => {
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker.register('/ngsw-worker.js');
    }
  })
  .catch(err => console.log(err));
