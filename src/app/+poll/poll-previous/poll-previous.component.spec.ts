import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { AppCommonModule } from '../../app-common.module';
import { COMPONENTS } from '../../components';
import { PROVIDERS } from '../../shared';

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
      ],
      declarations: [
        PollPreviousComponent,
        ...COMPONENTS,
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
