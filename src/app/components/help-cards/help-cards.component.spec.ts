import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from '../../app-common.module';
import { PROVIDERS } from '../../shared';

import { HelpCardsComponent } from './help-cards.component';

describe('HelpCardsComponent', () => {
  let component: HelpCardsComponent;
  let fixture: ComponentFixture<HelpCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        NoopAnimationsModule,
      ],
      providers: [
        ...PROVIDERS,
      ],
      declarations: [
        HelpCardsComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
