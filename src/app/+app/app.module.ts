import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppCommonModule } from '../app-common.module';

import { PROVIDERS, IsOwnerGuard, IsTokenGuard, IsPollGuard, IsConnectedGuard } from '../shared';

import { AppComponent } from './app.component';

import { AdminComponent } from './admin';
import { HomeComponent } from './home';
import { PollActiveComponent, PollPreviousComponent } from './poll';
import { FaqsOnAppComponent } from './faqs-on-app';

const routes = [
  // App
  {
    path: '',
    component: AppComponent,
    canActivate: [IsConnectedGuard, IsTokenGuard],
    canActivateChild: [IsConnectedGuard],
    children: [
      {path: '', component: HomeComponent},
      {path: 'admin', component: AdminComponent, canActivate: [IsOwnerGuard]},
      {path: 'active', component: PollActiveComponent},
      {path: 'closed/:address', component: PollPreviousComponent, canActivate: [IsPollGuard]},
      {path: 'faqs', component: FaqsOnAppComponent},
    ],
  },
];

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
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),

    AppCommonModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
})
export class AppModule { }
