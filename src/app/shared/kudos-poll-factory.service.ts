import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { KudosPollService } from './kudos-poll.service';

@Injectable()
export class KudosPollFactoryService {

  constructor(private web3Service: Web3Service) { }

  getKudosPollServiceAt(address: string): KudosPollService {
    const kudosPollService = new KudosPollService(this.web3Service);
    kudosPollService.initAt(address);
    return kudosPollService;
  }
}
