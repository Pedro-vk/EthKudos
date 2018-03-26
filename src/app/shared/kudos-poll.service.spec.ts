import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';

import { KudosPollService } from './kudos-poll.service';

describe('KudosPollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KudosPollService,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([KudosPollService], (service: KudosPollService) => {
    expect(service).toBeTruthy();
  }));
});
