import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppCommonModule } from '../../app-common.module';
import { ContentBaseComponent } from './content-base.abstract';

class ContentBaseExtendedComponent extends ContentBaseComponent { };

describe('ContentBaseComponent', () => {
  let component: ContentBaseComponent;
  let changeDetectorRefMarkForCheckSpy = jasmine.createSpy('markForCheck');

  beforeEach(() => {
    component = new ContentBaseExtendedComponent(<any>{markForCheck: changeDetectorRefMarkForCheckSpy});
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible after an small delay', done => {
    expect(component.visible).toBeUndefined();

    setTimeout(() => {
      expect(component.visible).toBeTruthy();
      expect(changeDetectorRefMarkForCheckSpy).toHaveBeenCalled();
      done();
    }, 100);
  });
});
