import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppCommonModule } from '../../../app-common.module';
import { PROVIDERS } from '../../../shared';
import { reducers, effects } from '../../../shared/store';

import { DonateComponent } from './donate.component';

describe('DonateComponent', () => {
  let component: DonateComponent;
  let fixture: ComponentFixture<DonateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        NoopAnimationsModule,

        StoreModule.forRoot({
          ...reducers,
        }),
        EffectsModule.forRoot(effects),
      ],
      providers: [
        ...PROVIDERS,
      ],
      declarations: [ DonateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
