import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { ContentBaseComponent } from '../content-base.abstract';

@Component({
  selector: 'eth-kudos-faqs-page',
  templateUrl: './faqs-page.component.html',
  styleUrls: ['./faqs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqsPageComponent extends ContentBaseComponent implements OnInit {

  constructor(protected changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
