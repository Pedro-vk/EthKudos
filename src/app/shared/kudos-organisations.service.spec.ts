import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';

import { KudosOrganisationsService } from './kudos-organisations.service';

describe('KudosOrganisationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KudosOrganisationsService,
        Web3Service,
        KudosPollFactoryService,
      ],
    });
  });

  it('should be created', inject([KudosOrganisationsService], (service: KudosOrganisationsService) => {
    expect(service).toBeTruthy();
  }));
});
