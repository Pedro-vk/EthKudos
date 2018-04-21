import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as translationEs from '../../i18n/es.json';
import * as translationEn from '../../i18n/en.json';

@Injectable()
export class TranslationLoaderService {
  getTranslation(lang: string): Observable<any> {
    switch (lang) {
      case 'es': return Observable.of(translationEs);
      default: return Observable.of(translationEn);
    }
  }
}
