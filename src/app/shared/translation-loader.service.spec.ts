import { TestBed, inject } from '@angular/core/testing';
import 'rxjs/add/operator/first';

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
      .first()
      .subscribe(({$lang}) => expect($lang).toBe('en'));
  }));

  it('should return Spanish translation', inject([TranslationLoaderService], (service: TranslationLoaderService) => {
    service
      .getTranslation('es')
      .first()
      .subscribe(({$lang}) => expect($lang).toBe('es'));
  }));
});
