import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { AppCommonModule } from '../../../app-common.module';
import { PROVIDERS } from '../../../shared';

import { PollPreviousComponent } from './poll-previous.component';

describe('PollPreviousComponent', () => {
  let component: PollPreviousComponent;
  let fixture: ComponentFixture<PollPreviousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
      ],
      declarations: [
        PollPreviousComponent,
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
    fixture = TestBed.createComponent(PollPreviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
