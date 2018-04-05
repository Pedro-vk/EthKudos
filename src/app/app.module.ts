import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './app-common.module';

import { AppWrapperComponent } from './app-wrapper.component';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { PROVIDERS } from './shared';

import { ADMIN_COMPONENTS } from './+admin';
import { COMPONENTS } from './components';
import { HOME_COMPONENTS } from './+home';
import { LANDING_COMPONENTS } from './+landing';
import { POLL_COMPONENTS } from './+poll';

@NgModule({
  declarations: [
    AppWrapperComponent,
    AppComponent,
    ...ADMIN_COMPONENTS,
    ...COMPONENTS,
    ...HOME_COMPONENTS,
    ...LANDING_COMPONENTS,
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
    Title,
  ],
  bootstrap: [AppWrapperComponent]
})
export class AppModule { }
