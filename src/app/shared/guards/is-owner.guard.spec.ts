import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Web3Service } from '../web3.service';
import { KudosTokenFactoryService } from '../kudos-token-factory.service';
import { KudosPollFactoryService } from '../kudos-poll-factory.service';

import { IsOwnerGuard } from './is-owner.guard';

describe('IsOwnerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        IsOwnerGuard,
        Web3Service,
        KudosTokenFactoryService,
        KudosPollFactoryService,
      ],
    });
  });

  it('should create', inject([IsOwnerGuard], (guard: IsOwnerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
