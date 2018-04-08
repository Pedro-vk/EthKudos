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

import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { ADMIN_COMPONENTS } from './+admin';
import { CONTENT_COMPONENTS } from './+content';
import { HOME_COMPONENTS } from './+home';
import { JOIN_COMPONENTS } from './+join';
import { LANDING_COMPONENTS } from './+landing';
import { POLL_COMPONENTS } from './+poll';

@NgModule({
  declarations: [
    AppWrapperComponent,
    AppComponent,

    ...COMPONENTS,
    ...ENTRY_COMPONENTS,

    ...ADMIN_COMPONENTS,
    ...CONTENT_COMPONENTS,
    ...HOME_COMPONENTS,
    ...JOIN_COMPONENTS,
    ...LANDING_COMPONENTS,
    ...POLL_COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
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
