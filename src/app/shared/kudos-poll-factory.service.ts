import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Web3Service } from './web3.service';

import { KudosPollService } from './contracts/kudos-poll.service';

@Injectable()
export class KudosPollFactoryService {
  private kudosPollInstances: {[address: string]: KudosPollService} = {};

  constructor(private web3Service: Web3Service, protected store: Store<any>) { }

  getKudosPollServiceAt(address: string): KudosPollService {
    if (+address === 0) {
      return;
    }
    if (this.kudosPollInstances[address]) {
      return this.kudosPollInstances[address];
    }
    const kudosPollService = new KudosPollService(this.web3Service, this.store);
    kudosPollService.initAt(address);
    this.kudosPollInstances[address] = kudosPollService;
    return kudosPollService;
  }
}
