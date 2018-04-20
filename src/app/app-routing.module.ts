import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsOwnerGuard, IsTokenGuard, IsPollGuard, IsConnectedGuard } from './shared';

import {
  AppComponent, HomeComponent, AdminComponent, PollActiveComponent, PollPreviousComponent,
  FaqsOnAppComponent, PollChartComponent,
} from './+app';
import {
  LandingComponent, ContentComponent, FaqsPageComponent, PrivacyPolicyComponent, JoinComponent,
  DonateComponent, AboutComponent,
} from './+website';

const routes: Routes = [
  // Website
  {path: '', component: LandingComponent, children: [
    {path: 'join/:tokenAddress', component: JoinComponent},
  ]},
  {path: 'error/:errorMessage', component: LandingComponent},

  // Website - content
  {path: '', component: ContentComponent, children: [
    {path: 'faqs', component: FaqsPageComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'donate', component: DonateComponent},
    {path: 'about', component: AboutComponent},
  ]},

  // App
  {
    path: ':tokenAddress',
    component: AppComponent,
    canActivate: [IsConnectedGuard, IsTokenGuard],
    canActivateChild: [IsConnectedGuard],
    children: [
      {path: '', component: HomeComponent},
      {path: 'admin', component: AdminComponent, canActivate: [IsOwnerGuard]},
      {path: 'active', component: PollActiveComponent},
      {path: 'closed/:address', component: PollPreviousComponent, canActivate: [IsPollGuard]},
      {path: 'graph/:address', component: PollChartComponent/*, canActivate: [IsPollGuard]*/},
      {path: 'faqs', component: FaqsOnAppComponent},
    ],
  },

  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
