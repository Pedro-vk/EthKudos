import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { of as observableOf, Observable } from 'rxjs';

import { AppCommonModule } from '../../../app-common.module';
import { PROVIDERS } from '../../../shared';

import { PollActiveComponent } from './poll-active.component';

describe('PollActiveComponent', () => {
  let component: PollActiveComponent;
  let fixture: ComponentFixture<PollActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
      ],
      declarations: [
        PollActiveComponent,
      ],
      providers: [
        ...PROVIDERS,
        {
          provide: ActivatedRoute, useValue: ((_: any) => {
            _.parent = {};
            _.params = _.parent.params = observableOf({tokenAddress: `0x${'0'.repeat(40)}`});
            return _;
          })({}),
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
