import { NgModule } from '@angular/core';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { AppComponent } from './app.component';

import { AdminComponent } from './admin';
import { HomeComponent } from './home';
import { PollActiveComponent, PollPreviousComponent, PollChartComponent } from './poll';
import { FaqsOnAppComponent } from './faqs-on-app';

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    FaqsOnAppComponent,
    HomeComponent,
    PollActiveComponent,
    PollChartComponent,
    PollPreviousComponent,
  ],
  imports: [
    AppCommonModule,
    AppRoutingModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
})
export class AppModule { }
