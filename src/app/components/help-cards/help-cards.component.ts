import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

import * as MetamaskLogo from 'metamask-logo';

import { Web3Service, cardInOutAnimation } from '../../shared';

@Component({
  selector: 'eth-kudos-help-cards',
  templateUrl: './help-cards.component.html',
  styleUrls: ['./help-cards.component.scss'],
  animations: [cardInOutAnimation],
})
export class HelpCardsComponent implements AfterViewChecked {

  metamaskInstallationClicked: boolean;
  metamaskInstallationLink: string = this.web3Service.getMetamaskInstallationLink();
  @ViewChild('metamaskLogo') metamaskLogo: ElementRef;
  private metamaskLogoViewer: any;

  readonly status$ = this.web3Service.status$;

  constructor(private web3Service: Web3Service) { }

  ngAfterViewChecked() {
    if (this.metamaskLogo && this.metamaskLogo.nativeElement.offsetParent) {
      if (!this.metamaskLogoViewer) {
        this.metamaskLogoViewer = MetamaskLogo({
          pxNotRatio: true,
          width: 80,
          height: 80,
          followMouse: true,
          slowDrift: false,
        });
      }
      this.metamaskLogo.nativeElement.appendChild(this.metamaskLogoViewer.container);
    }
  }

  reload(): void {
    window.location.reload();
  }
}
