import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { LandingComponent } from './landing';
import { JoinComponent } from './join';
import { ContentComponent, FaqsPageComponent, PrivacyPolicyComponent } from './content';

const routes = [
  // Website
  {path: '', component: LandingComponent, children: [
    {path: 'join/:tokenAddress', component: JoinComponent},
  ]},
  {path: 'error/:errorMessage', component: LandingComponent},

  // Website - content
  {path: '', component: ContentComponent, children: [
    {path: 'faqs', component: FaqsPageComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
  ]},
];


@NgModule({
  declarations: [
    JoinComponent,
    LandingComponent,
    ContentComponent,
    FaqsPageComponent,
    PrivacyPolicyComponent,
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
export class WebsiteModule { }
