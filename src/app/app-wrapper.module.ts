import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler, MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';

import { AppRoutingModule } from './app-routing.module';
import { AppCommonModule } from './app-common.module';

import { AppWrapperComponent } from './app-wrapper.component';

import { environment } from '../environments/environment';

import { PROVIDERS } from './shared';

import { AppModule } from './+app/app.module';
import { WebsiteModule } from './+website/website.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/');
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
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
    }),

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
