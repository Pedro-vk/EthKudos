import { NgModule } from '@angular/core';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { LandingComponent } from './landing';
import { JoinComponent } from './join';
import { ContentComponent, FaqsPageComponent, PrivacyPolicyComponent, DonateComponent } from './content';

@NgModule({
  declarations: [
    JoinComponent,
    LandingComponent,
    ContentComponent,
    FaqsPageComponent,
    PrivacyPolicyComponent,
    DonateComponent,
  ],
  imports: [
    AppCommonModule,
    AppRoutingModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
})
export class WebsiteModule { }
