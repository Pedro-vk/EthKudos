import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Web3Service } from './web3.service';

import { IsConnectedGuard } from './is-connected.guard';

describe('IsConnectedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        IsConnectedGuard,
        Web3Service,
      ],
    });
  });

  it('should create', inject([IsConnectedGuard], (guard: IsConnectedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
