export * from './content.component';
export * from './donate/donate.component';
export * from './faqs-page/faqs-page.component';
export * from './privacy-policy/privacy-policy.component';

import { ContentComponent } from './content.component';
import { DonateComponent } from './donate/donate.component';
import { FaqsPageComponent } from './faqs-page/faqs-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const CONTENT_COMPONENTS = [
  ContentComponent,
  DonateComponent,
  FaqsPageComponent,
  PrivacyPolicyComponent,
];
