import { NgModule } from '@angular/core';

import { AppCommonModule } from '../app-common.module';
import { AppRoutingModule } from '../app-routing.module';

import { PROVIDERS } from '../shared';

import { LandingComponent } from './landing';
import { JoinComponent } from './join';
import { CONTENT_COMPONENTS } from './content';

@NgModule({
  declarations: [
    JoinComponent,
    LandingComponent,
    ...CONTENT_COMPONENTS,
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
