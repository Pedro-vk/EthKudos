import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollActiveComponent } from './poll-active.component';

describe('PollActiveComponent', () => {
  let component: PollActiveComponent;
  let fixture: ComponentFixture<PollActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollActiveComponent ]
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
