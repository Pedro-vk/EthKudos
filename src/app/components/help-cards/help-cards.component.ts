import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';

import * as MetamaskLogo from 'metamask-logo';

import * as fromRoot from '../../shared/store/reducers';

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

  readonly status$ = this.store.select(fromRoot.getStatus);
  readonly provider$ = this.store.select(fromRoot.getProvider);

  constructor(private store: Store<fromRoot.State>, private web3Service: Web3Service) { }

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

  enableProvider() {
    this.web3Service.requestEnable();
  }
}
