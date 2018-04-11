import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/first';

import { Web3Service, networkType } from '../../../shared';

@Component({
  selector: 'eth-kudos-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonateComponent implements OnInit {
  visible: boolean;
  copied: boolean;
  donationAmount = 0.01;
  pendingDonation: {working: boolean, tx?: string, confirmations?: number} = {working: undefined};
  @ViewChild('address') addressElement: ElementRef;

  readonly donationAddress = '0x178a262C6B2FFB042f5cb1A7a20d7edbDdb3B16D';
  readonly status$ = this.web3Service.status$;
  readonly network$ = this.web3Service.getNetworkType();

  constructor(private web3Service: Web3Service, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    }, 10);
  }

  copyAddress() {
    this.copied = true;

    const range = document.createRange();
    range.selectNodeContents(this.addressElement.nativeElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');

    selection.removeAllRanges();

    setTimeout(() => this.copied = false, 2000);
  }

  donate() {
    const check = fn => {
      fn();
      this.changeDetectorRef.markForCheck();
    };
    this.web3Service.account$
      .first()
      .subscribe(userAccount => {
        this.pendingDonation = {working: true};
        const pendingDonation = this.pendingDonation;

        this.web3Service
          .web3
          .eth
          .sendTransaction({
            to: this.donationAddress,
            from: userAccount,
            value: this.web3Service.web3.utils.toWei(String(this.donationAmount), 'ether'),
          })
          .on('transactionHash', tx => check(() => pendingDonation.tx = tx))
          .on('receipt', () => check(() => pendingDonation.working = undefined))
          .on('confirmation', n => check(() => pendingDonation.confirmations = n))
          .on('error', data => check(() => pendingDonation.working = undefined));
      });
  }

  goToEtherscan(tx: string): void {
    this.web3Service.goToEtherscan(tx);
  }
}
