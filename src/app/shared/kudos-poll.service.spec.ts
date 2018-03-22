import { TestBed, inject } from '@angular/core/testing';

import { KudosPollService } from './kudos-poll.service';

describe('KudosPollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KudosPollService]
    });
  });

  it('should be created', inject([KudosPollService], (service: KudosPollService) => {
    expect(service).toBeTruthy();
  }));
});
