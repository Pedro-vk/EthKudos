import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import * as accountActions from './account.actions';

@Injectable()
export class AccountEffects {
  constructor(private actions$: Actions) { }
}
