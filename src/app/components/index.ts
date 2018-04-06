export * from './blockie/blockie.component';
export * from './help-cards/help-cards.component';
export * from './share-dialog/share-dialog.component';

import { BlockieComponent } from './blockie/blockie.component';
import { HelpCardsComponent } from './help-cards/help-cards.component';

import { ShareDialogComponent } from './share-dialog/share-dialog.component';

export const COMPONENTS = [
  BlockieComponent,
  HelpCardsComponent,
];
export const ENTRY_COMPONENTS = [
  ShareDialogComponent,
];
