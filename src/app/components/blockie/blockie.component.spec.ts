import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

import { AppMaterialModule } from '../../app-common.module';
import { COMPONENTS } from '../../components';
import { PROVIDERS } from '../../shared';
import { reducers } from '../../shared/store';

import { BlockieComponent } from './blockie.component';

describe('BlockieComponent', () => {
  let component: BlockieComponent;
  let fixture: ComponentFixture<BlockieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot(reducers),
      ],
      declarations: [
        BlockieComponent,
      ],
      providers: [
        ...PROVIDERS,
      ],
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
