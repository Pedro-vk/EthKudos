import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppWrapperComponent } from './app-wrapper.component';

import { PROVIDERS } from './shared';

@NgModule({
  declarations: [
    AppWrapperComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [
    ...PROVIDERS,
    Title,
  ],
  bootstrap: [AppWrapperComponent]
})
export class AppWrapperModule { }
