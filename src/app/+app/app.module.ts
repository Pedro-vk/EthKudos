import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { AppComponent } from './app.component';

import { AdminComponent } from './admin';
import { HomeComponent } from './home';
import { PollActiveComponent, PollPreviousComponent } from './poll';
import { FaqsOnAppComponent } from './faqs-on-app';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    PollActiveComponent,
    PollPreviousComponent,
    FaqsOnAppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AppCommonModule,
    AppRoutingModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
})
export class AppModule { }
