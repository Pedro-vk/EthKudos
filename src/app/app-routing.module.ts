import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsOwnerGuard, IsTokenGuard, IsPollGuard, IsConnectedGuard } from './shared';

import {
  AppComponent, HomeComponent, AdminComponent, PollActiveComponent, PollPreviousComponent, FaqsOnAppComponent,
} from './+app';
import { LandingComponent, ContentComponent, FaqsPageComponent, PrivacyPolicyComponent, JoinComponent } from './+website';

const routes: Routes = [
  // Website
  {path: '', loadChildren: 'app/+website/website.module#WebsiteModule'},

  // App
  {path: ':tokenAddress', loadChildren: 'app/+app/app.module#AppModule'},

  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
