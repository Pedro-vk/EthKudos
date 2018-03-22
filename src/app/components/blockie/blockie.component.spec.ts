import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockieComponent } from './blockie.component';

describe('BlockieComponent', () => {
  let component: BlockieComponent;
  let fixture: ComponentFixture<BlockieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
