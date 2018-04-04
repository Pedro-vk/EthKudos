import { TestBed, async, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';
import { KudosTokenService } from './kudos-token.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';

import { IsPollGuard } from './is-poll.guard';

describe('IsPollGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsPollGuard,
        Web3Service,
        KudosTokenService,
        KudosPollFactoryService,
      ],
    });
  });

  it('should create', inject([IsPollGuard], (guard: IsPollGuard) => {
    expect(guard).toBeTruthy();
  }));
});
