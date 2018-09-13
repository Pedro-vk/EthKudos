import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { AppCommonModule } from '../../app-common.module';
import { PROVIDERS } from '../../shared';
import { reducers, effects } from '../../shared/store';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,

        StoreModule.forRoot({
          ...reducers,
        }),
        EffectsModule.forRoot(effects),
      ],
      declarations: [
        LandingComponent,
      ],
      providers: [
        ...PROVIDERS,
        {
          provide: ActivatedRoute, useValue: ((_: any) => {
            _.parent = {};
            _.parent.params = _.params = Observable.empty();
            return _;
          })({}),
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
