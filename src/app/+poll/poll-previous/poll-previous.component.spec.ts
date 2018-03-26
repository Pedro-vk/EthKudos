import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollPreviousComponent } from './poll-previous.component';

describe('PollPreviousComponent', () => {
  let component: PollPreviousComponent;
  let fixture: ComponentFixture<PollPreviousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollPreviousComponent ]
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
