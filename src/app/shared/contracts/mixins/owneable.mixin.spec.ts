import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from '../../web3.service';

import { OwnableMixin } from './owneable.mixin';

describe('OwnableMixin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnableMixin,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([OwnableMixin], (service: OwnableMixin) => {
    expect(service).toBeTruthy();
  }));
});
