import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from '../../web3.service';

import { BurnableTokenMixin } from './burnable-token.mixin';

describe('BurnableTokenMixin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BurnableTokenMixin,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([BurnableTokenMixin], (service: BurnableTokenMixin) => {
    expect(service).toBeTruthy();
  }));
});
