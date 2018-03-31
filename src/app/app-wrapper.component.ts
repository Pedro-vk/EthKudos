import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'eth-kudos-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWrapperComponent {
  constructor() { }
}
