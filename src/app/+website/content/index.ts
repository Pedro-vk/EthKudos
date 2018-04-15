export * from './content.component';

export * from './about/about.component';
export * from './donate/donate.component';
export * from './faqs-page/faqs-page.component';
export * from './privacy-policy/privacy-policy.component';

import { ContentComponent } from './content.component';

import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { FaqsPageComponent } from './faqs-page/faqs-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const CONTENT_COMPONENTS = [
  ContentComponent,

  AboutComponent,
  DonateComponent,
  FaqsPageComponent,
  PrivacyPolicyComponent,
];
