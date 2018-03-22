import { TestBed, inject } from '@angular/core/testing';

import { KudosPollFactoryService } from './kudos-poll-factory.service';

describe('KudosPollFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KudosPollFactoryService]
    });
  });

  it('should be created', inject([KudosPollFactoryService], (service: KudosPollFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
