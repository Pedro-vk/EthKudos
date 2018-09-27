import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { shareReplay, map } from 'rxjs/operators';
import * as blockies from 'blockies';

import * as fromRoot from '../../shared/store/reducers';

@Component({
  selector: 'eth-kudos-blockie',
  templateUrl: './blockie.component.html',
  styleUrls: ['./blockie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockieComponent implements OnInit, OnChanges {
  @Input() address: string;
  @Input() variant: string;
  @Input() noicon: undefined;
  @Input() random: number;
  blockie: SafeStyle;

  readonly isActiveAccount$ = this.store.pipe(
    select(fromRoot.getAccount),
    map((account: string = '') => (this.address || '').toLowerCase() === account.toLowerCase()),
    shareReplay(1));

  constructor(private store: Store<fromRoot.State>, private domSanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.random !== undefined) {
      const changeIt = () => {
        this.blockie = this.getImageOf(`###${Math.random() * (10 ** 4)}###`);
        this.changeDetectorRef.markForCheck();
      };
      changeIt();
      setInterval(() => changeIt(), +this.random || 1000);
    }
  }

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
