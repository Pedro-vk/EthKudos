import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import { Web3Service, KudosPollService, KudosPollFactoryService } from '../../';

import * as fromRoot from '../reducers';
import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollData } from './kudos-poll.models';

@Injectable()
export class KudosPollEffects {
  constructor(private store: Store<fromRoot.State>) { }
}
