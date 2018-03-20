import { TestBed, inject } from '@angular/core/testing';

import { KudosTokenService } from './kudos-token.service';

describe('KudosTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KudosTokenService]
    });
  });

  it('should be created', inject([KudosTokenService], (service: KudosTokenService) => {
    expect(service).toBeTruthy();
  }));
});
