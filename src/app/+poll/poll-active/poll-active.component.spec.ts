import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from '../../app-common.module';
import { COMPONENTS } from '../../components';
import { PROVIDERS } from '../../shared';

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
      ],
      declarations: [
        PollActiveComponent,
        ...COMPONENTS,
      ],
      providers: [
        ...PROVIDERS,
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
