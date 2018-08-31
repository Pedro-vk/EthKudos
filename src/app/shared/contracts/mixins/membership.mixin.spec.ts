import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from '../../web3.service';

import { MembershipMixin } from './membership.mixin';

describe('MembershipMixin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MembershipMixin,
        Web3Service,
      ]
    });
  });

  it('should be created', inject([MembershipMixin], (service: MembershipMixin) => {
    expect(service).toBeTruthy();
  }));
});
