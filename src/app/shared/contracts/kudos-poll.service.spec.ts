import { TestBed, inject } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { Web3Service } from '../web3.service';

import { KudosPollService } from './kudos-poll.service';

describe('KudosPollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        KudosPollService,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([KudosPollService], (service: KudosPollService) => {
    expect(service).toBeTruthy();
  }));
});
