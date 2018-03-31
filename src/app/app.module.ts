import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './app-common.module';

import { AppWrapperComponent } from './app-wrapper.component';
console.log({AppWrapperComponent})
import { AppComponent } from './app.component';

import { PROVIDERS } from './shared';

import { environment } from '../environments/environment';
import { COMPONENTS } from './components';
import { HOME_COMPONENTS } from './+home';
import { ADMIN_COMPONENTS } from './+admin';
import { POLL_COMPONENTS } from './+poll';

@NgModule({
  declarations: [
    AppWrapperComponent,
    AppComponent,
    ...COMPONENTS,
    ...HOME_COMPONENTS,
    ...ADMIN_COMPONENTS,
    ...POLL_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AppCommonModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
  bootstrap: [AppWrapperComponent]
})
export class AppModule { }
