import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsOwnerGuard } from './shared';
import { AdminComponent } from './+admin';

const routes: Routes = [
  {path: 'admin', component: AdminComponent, canActivate: [IsOwnerGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
