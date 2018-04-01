import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsOwnerGuard } from './shared';
import { AppComponent } from './app.component';
import { LandingComponent } from './+landing';
import { HomeComponent } from './+home';
import { AdminComponent } from './+admin';
import { PollActiveComponent, PollPreviousComponent } from './+poll';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: ':tokenAddress', component: AppComponent, children: [
    {path: '', component: HomeComponent},
    {path: 'admin', component: AdminComponent, canActivate: [IsOwnerGuard]},
    {path: 'active', component: PollActiveComponent},
    {path: 'closed/:address', component: PollPreviousComponent},
  ]},
  {path: '**', redirectTo: '/'}, // Temporal path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
