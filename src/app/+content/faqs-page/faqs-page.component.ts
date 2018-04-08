import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'eth-kudos-faqs-page',
  templateUrl: './faqs-page.component.html',
  styleUrls: ['./faqs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqsPageComponent implements OnInit {
  visible: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    });
  }
}
