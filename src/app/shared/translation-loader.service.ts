import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';

import * as translationEs from '../../i18n/es.json';
import * as translationEn from '../../i18n/en.json';

@Injectable()
export class TranslationLoaderService {
  getTranslation(lang?: string): Observable<{[key: string]: string} & {$lang: string}> {
    switch (lang) {
      case 'es': return observableOf({...translationEs, $lang: 'es'});
      default: return observableOf({...translationEn, $lang: 'en'});
    }
  }
}
