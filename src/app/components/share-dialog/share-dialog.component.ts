import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'eth-kudos-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
})
export class ShareDialogComponent {
  copied: boolean;
  @ViewChild('shareUrl') shareUrlElement: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public tokenAddress: string) { }

  copyShareUrl() {
    this.copied = true;
    this.shareUrlElement.nativeElement.select();
    document.execCommand('copy');
    setTimeout(() => this.copied = false, 2000);
  }
}
