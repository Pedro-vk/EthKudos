import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';

import { KudosPollFactoryService } from './kudos-poll-factory.service';

describe('KudosPollFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KudosPollFactoryService,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([KudosPollFactoryService], (service: KudosPollFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
