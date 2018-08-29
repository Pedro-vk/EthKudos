import { browser, by, element, ElementFinder, ElementArrayFinder, ExpectedConditions as until } from 'protractor';

import { Page } from './page.abstract.po';
import * as helpers from '../helpers';

export class LandingDonatePage extends Page {
  readonly getDonateInput = helpers.getElementByDataQa('landing-donate-input-donate');
  readonly getDonateButton = helpers.getElementByDataQa('landing-donate-make-donate');

  readonly getTransactionBlock = helpers.getElementByDataQa('landing-donate-tx-block');
  readonly getTransactionConfirmations = helpers.getElementByDataQa('landing-donate-tx-confirmations');
  readonly getTransactionCloseButton = helpers.getElementByDataQa('landing-donate-tx-close');

  readonly waitForTransactionConfirmed = helpers.waitUntilElementByDataQa('landing-donate-tx-confirmations', 20000);

  async navigateTo() {
    await this.goToPath('/donate');
  }

  async sendDonation() {
    (await this.getDonateButton()).click();
    await await this.getTransactionBlock.waitUntil(100);
  }
}
