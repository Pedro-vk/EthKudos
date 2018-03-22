import { TestBed, async, inject } from '@angular/core/testing';

import { IsOwnerGuard } from './is-owner.guard';

describe('IsOwnerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsOwnerGuard]
    });
  });

  it('should ...', inject([IsOwnerGuard], (guard: IsOwnerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
