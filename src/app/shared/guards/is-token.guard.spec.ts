import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { Web3Service } from '../web3.service';
import { KudosTokenFactoryService } from '../kudos-token-factory.service';
import { KudosPollFactoryService } from '../kudos-poll-factory.service';

import { IsTokenGuard } from './is-token.guard';

describe('IsTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        IsTokenGuard,
        Web3Service,
        KudosTokenFactoryService,
        KudosPollFactoryService,
      ],
    });
  });

  it('should create', inject([IsTokenGuard], (guard: IsTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
