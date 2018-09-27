import { TestBed, inject } from '@angular/core/testing';
import { first } from 'rxjs/operators';

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

  it('should return English as default translation', inject([TranslationLoaderService], (service: TranslationLoaderService) => {
    service
      .getTranslation()
      .pipe(first())
      .subscribe(({$lang}) => expect($lang).toBe('en'));
  }));

  it('should return Spanish translation', inject([TranslationLoaderService], (service: TranslationLoaderService) => {
    service
      .getTranslation('es')
      .pipe(first())
      .subscribe(({$lang}) => expect($lang).toBe('es'));
  }));
});
