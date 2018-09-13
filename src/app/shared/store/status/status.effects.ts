import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as statusActions from './status.actions';

@Injectable()
export class StatusEffects {
  constructor(private actions$: Actions) { }
}
