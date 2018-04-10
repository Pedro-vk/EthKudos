import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { AppCommonModule } from '../../app-common.module';
import { PROVIDERS } from '../../shared';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppCommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        AdminComponent,
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
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
