import { TestBed, async, inject } from '@angular/core/testing';

import { Web3Service } from './web3.service';
import { KudosTokenFactoryService } from './kudos-token-factory.service';

import { IsTokenGuard } from './is-token.guard';

describe('IsTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsTokenGuard,
        Web3Service,
        KudosTokenFactoryService,
      ],
    });
  });

  it('should create', inject([IsTokenGuard], (guard: IsTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
