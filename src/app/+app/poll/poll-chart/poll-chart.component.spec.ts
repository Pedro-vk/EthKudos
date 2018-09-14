import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PROVIDERS } from '../../../shared';

import { AppCommonModule } from '../../../app-common.module';
import { PollChartComponent } from './poll-chart.component';

describe('PollChartComponent', () => {
  let component: PollChartComponent;
  let fixture: ComponentFixture<PollChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
      ],
      declarations: [ PollChartComponent ],
      providers: [
        ...PROVIDERS,
        {
          provide: ActivatedRoute, useValue: ((_: any) => {
            _.parent = {};
            _.params = _.parent.params = Observable.of({tokenAddress: `0x${'0'.repeat(40)}`});
            return _;
          })({}),
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
