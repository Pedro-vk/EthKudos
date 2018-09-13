import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';

import { AppMaterialModule } from '../../app-common.module';
import { PROVIDERS } from '../../shared';
import { reducers, effects } from '../../shared/store';

import { HelpCardsComponent } from './help-cards.component';

describe('HelpCardsComponent', () => {
  let component: HelpCardsComponent;
  let fixture: ComponentFixture<HelpCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),

        StoreModule.forRoot({
          ...reducers,
        }),
        EffectsModule.forRoot(effects),
      ],
      providers: [
        ...PROVIDERS,
      ],
      declarations: [
        HelpCardsComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
