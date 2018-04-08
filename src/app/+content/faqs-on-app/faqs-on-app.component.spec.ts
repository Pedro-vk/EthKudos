import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from '../../app-common.module';
import { COMPONENTS } from '../../components';

import { FaqsOnAppComponent } from './faqs-on-app.component';

describe('FaqsOnAppComponent', () => {
  let component: FaqsOnAppComponent;
  let fixture: ComponentFixture<FaqsOnAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        NoopAnimationsModule,
      ],
      declarations: [
        FaqsOnAppComponent,
        ...COMPONENTS,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqsOnAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
