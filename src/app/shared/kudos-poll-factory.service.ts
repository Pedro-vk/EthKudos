import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { KudosPollService } from './kudos-poll.service';

@Injectable()
export class KudosPollFactoryService {
  private kudosPollInstances: {[address: string]: KudosPollService} = {};

  constructor(private web3Service: Web3Service) { }

  getKudosPollServiceAt(address: string): KudosPollService {
    if (+address === 0) {
      return;
    }
    if (this.kudosPollInstances[address]) {
      return this.kudosPollInstances[address];
    }
    const kudosPollService = new KudosPollService(this.web3Service);
    kudosPollService.initAt(address);
    this.kudosPollInstances[address] = kudosPollService;
    return kudosPollService;
  }
}
