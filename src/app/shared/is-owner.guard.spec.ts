import { TestBed, async, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';
import { KudosTokenService } from './kudos-token.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';

import { IsOwnerGuard } from './is-owner.guard';

describe('IsOwnerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsOwnerGuard,
        Web3Service,
        KudosTokenService,
        KudosPollFactoryService,
      ],
    });
  });

  it('should create', inject([IsOwnerGuard], (guard: IsOwnerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
