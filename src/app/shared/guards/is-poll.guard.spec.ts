import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { Web3Service } from '../web3.service';
import { KudosTokenService } from '../contracts/kudos-token.service';
import { KudosTokenFactoryService } from '../kudos-token-factory.service';
import { KudosPollFactoryService } from '../kudos-poll-factory.service';

import { IsPollGuard } from './is-poll.guard';

describe('IsPollGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        IsPollGuard,
        Web3Service,
        KudosTokenService,
        KudosTokenFactoryService,
        KudosPollFactoryService,
      ],
    });
  });

  it('should create', inject([IsPollGuard], (guard: IsPollGuard) => {
    expect(guard).toBeTruthy();
  }));
});
