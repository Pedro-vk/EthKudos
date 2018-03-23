import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import blockies from 'blockies';

@Component({
  selector: 'eth-kudos-blockie',
  templateUrl: './blockie.component.html',
  styleUrls: ['./blockie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockieComponent implements OnChanges {
  @Input() address: string;
  @Input() variant: string;
  blockie: SafeStyle;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.address) {
      this.blockie = this.getImageOf(this.address);
    }
  }

  getImageOf(account: string): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(
      `url(${blockies({seed: (account || '#').toLowerCase(), size: 8, scale: 8}).toDataURL()})`,
    );
  }
}
