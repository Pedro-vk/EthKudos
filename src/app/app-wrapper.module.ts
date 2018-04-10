import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './app-common.module';

import { AppWrapperComponent } from './app-wrapper.component';

import { environment } from '../environments/environment';

import { PROVIDERS } from './shared';

import { AppModule } from './+app/app.module';

import { CONTENT_COMPONENTS } from './+content';
import { JOIN_COMPONENTS } from './+join';
import { LANDING_COMPONENTS } from './+landing';

@NgModule({
  declarations: [
    AppWrapperComponent,

    ...CONTENT_COMPONENTS,
    ...JOIN_COMPONENTS,
    ...LANDING_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AppCommonModule,

    AppModule,
  ],
  providers: [
    ...PROVIDERS,
    Title,
  ],
  bootstrap: [AppWrapperComponent]
})
export class AppWrapperModule { }
