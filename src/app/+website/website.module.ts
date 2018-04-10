import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { LandingComponent } from './landing';
import { JoinComponent } from './join';
import { FaqsPageComponent, PrivacyPolicyComponent } from './content';

@NgModule({
  declarations: [
    JoinComponent,
    LandingComponent,
    FaqsPageComponent,
    PrivacyPolicyComponent,
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
export class WebsiteModule { }
