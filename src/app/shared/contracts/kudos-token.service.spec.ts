import { TestBed, inject } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { Web3Service } from '../web3.service';
import { KudosPollFactoryService } from '../kudos-poll-factory.service';

import { KudosTokenService } from './kudos-token.service';

describe('KudosTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        KudosTokenService,
        Web3Service,
        KudosPollFactoryService,
      ],
    });
  });

  it('should be created', inject([KudosTokenService], (service: KudosTokenService) => {
    expect(service).toBeTruthy();
  }));
});
