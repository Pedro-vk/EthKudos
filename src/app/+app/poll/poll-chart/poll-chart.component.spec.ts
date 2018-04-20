import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollChartComponent } from './poll-chart.component';

describe('PollChartComponent', () => {
  let component: PollChartComponent;
  let fixture: ComponentFixture<PollChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollChartComponent ]
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
