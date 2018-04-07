export * from './blockie/blockie.component';
export * from './faqs/faqs.component';
export * from './help-cards/help-cards.component';
export * from './share-dialog/share-dialog.component';

import { BlockieComponent } from './blockie/blockie.component';
import { FaqsComponent } from './faqs/faqs.component';
import { HelpCardsComponent } from './help-cards/help-cards.component';

import { ShareDialogComponent } from './share-dialog/share-dialog.component';

export const COMPONENTS = [
  BlockieComponent,
  FaqsComponent,
  HelpCardsComponent,
];
export const ENTRY_COMPONENTS = [
  ShareDialogComponent,
];
