import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Transaction } from 'web3/types';

import { Web3Service } from '../../web3.service';

import * as fromRoot from '../reducers';
import * as kudosTokenActions from './kudos-token.actions';

@Injectable()
export class KudosTokenEffects {
  constructor(private actions$: Actions, private web3Service: Web3Service) { }
}
