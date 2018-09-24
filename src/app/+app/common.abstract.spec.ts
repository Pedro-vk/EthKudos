import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCommonAbstract } from './common.abstract';

class AppCommonAbstractExtended extends AppCommonAbstract { }

describe('AppComponent', () => {
  let component: AppCommonAbstract;

  beforeEach(async(() => {
    component = new AppCommonAbstractExtended();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track a member', () => {
    expect(component.trackMember(0, {member: '0x0000'})).toBe('0x0000');
    expect(component.trackMember(0, <any>{})).toBeUndefined();
  });

  it('should track a gratitude', () => {
    expect(component.trackGratitude(1)).toBe('1');
  });

  it('should track a poll', () => {
    expect(component.trackPoll(0, {address: '0x0000'})).toBe('0x0000');
    expect(component.trackPoll(0, <any>{})).toBeUndefined();
  });
});
