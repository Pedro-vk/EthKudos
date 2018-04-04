import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';

import { KudosTokenFactoryService } from './kudos-token-factory.service';

describe('KudosTokenFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KudosTokenFactoryService,
        Web3Service,
        KudosPollFactoryService,
      ]
    });
  });

  it('should be created', inject([KudosTokenFactoryService], (service: KudosTokenFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
