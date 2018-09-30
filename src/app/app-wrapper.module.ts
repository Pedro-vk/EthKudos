import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en-GB';
import localeEs from '@angular/common/locales/es';
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler, MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import Web3 from 'web3';
import moesif from 'moesif-browser-js';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './app-common.module';

import { AppWrapperComponent } from './app-wrapper.component';

import { environment } from '../environments/environment';

import {
  PROVIDERS, TranslationLoaderService, Web3Service,
  WEB3_PROVIDER, MOESIF_INSTANCE_TOKEN, moesifSkipEvent, moesifGetMetadata,
} from './shared';
import { effects, reducers } from './shared/store';

import { AppModule } from './+app/app.module';
import { WebsiteModule } from './+website/website.module';


if (environment.moesifToken) {
  moesif.init({
    applicationId: environment.moesifToken,
    skip: event => moesifSkipEvent(event),
    getMetadata: event => moesifGetMetadata(event, Web3Service.env),
  });
  moesif.start();
}

registerLocaleData(localeEn, 'en');
registerLocaleData(localeEs, 'es');

export function getCurrentValidLocale() {
  const lang = (navigator.language || (<any>navigator).userLanguage).split('-')[0];
  switch (lang) {
    case 'es':
      return lang;
  }
  return 'en';
}

@NgModule({
  declarations: [
    AppWrapperComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationLoaderService,
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),

    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({name: 'EthKudos' + (environment.production ? '' : ' (local)')}),

    AppCommonModule,

    AppModule,
    WebsiteModule,
  ],
  providers: [
    ...PROVIDERS,
    Title,
    {provide: LOCALE_ID, useValue: getCurrentValidLocale()},
    {
      provide: WEB3_PROVIDER,
      useValue: () => environment.web3Provider || Web3.givenProvider || ((<any>window).web3 && (<any>window).web3.currentProvider),
    },
    ...(environment.moesifToken ? [{provide: MOESIF_INSTANCE_TOKEN, useValue: moesif}] : []),
  ],
  bootstrap: [AppWrapperComponent],
})
export class AppWrapperModule { }
