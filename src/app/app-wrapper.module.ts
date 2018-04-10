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
import { WebsiteModule } from './+website/website.module';


@NgModule({
  declarations: [
    AppWrapperComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AppCommonModule,

    AppModule,
    WebsiteModule,
  ],
  providers: [
    ...PROVIDERS,
    Title,
  ],
  bootstrap: [AppWrapperComponent]
})
export class AppWrapperModule { }
