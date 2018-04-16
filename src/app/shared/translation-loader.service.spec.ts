import { TestBed, inject } from '@angular/core/testing';

import { TranslationLoaderService } from './translation-loader.service';

describe('TranslationLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationLoaderService]
    });
  });

  it('should be created', inject([TranslationLoaderService], (service: TranslationLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
