import { OnInit, ChangeDetectorRef } from '@angular/core';

export abstract class ContentBaseComponent implements OnInit {
  visible: boolean;

  constructor(protected changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    }, 10);
  }
}
