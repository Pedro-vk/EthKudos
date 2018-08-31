import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from '../../web3.service';

import { BasicTokenMixin } from './basic-token.mixin';

describe('BasicTokenMixin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BasicTokenMixin,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([BasicTokenMixin], (service: BasicTokenMixin) => {
    expect(service).toBeTruthy();
  }));
});
