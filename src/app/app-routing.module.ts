import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsOwnerGuard, IsTokenGuard, IsPollGuard, IsConnectedGuard } from './shared';
import {
  AppComponent, HomeComponent, AdminComponent, PollActiveComponent, PollPreviousComponent, FaqsOnAppComponent,
} from './+app';

import { LandingComponent } from './+landing';
import { FaqsPageComponent, PrivacyPolicyComponent } from './+content';
import { JoinComponent } from './+join';

const routes: Routes = [
  {path: '', component: LandingComponent, children: [
    {path: 'join/:tokenAddress', component: JoinComponent},
  ]},
  {path: 'error/:errorMessage', component: LandingComponent},
  {path: 'faqs', component: FaqsPageComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
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
