import { browser, by, element, ElementFinder, ElementArrayFinder, ExpectedConditions as until } from 'protractor';

import { Page } from '../../page.abstract.po';

export class LandingDonatePage extends Page {
  readonly getDonateInput = this.dataQa('landing-donate-input-donate');
  readonly getDonateButton = this.dataQa('landing-donate-make-donate');

  readonly getTransactionBlock = this.dataQa('landing-donate-tx-block');
  readonly getTransactionConfirmations = this.dataQa('landing-donate-tx-confirmations');
  readonly getTransactionCloseButton = this.dataQa('landing-donate-tx-close');

  async navigateTo() {
    await this.goToPath('/donate');
  }

  async sendDonation() {
    (await this.getDonateButton()).click();
    await this.waitUntilElement(await this.getTransactionBlock());
  }

  async waitForTransactionConfirmed() {
    return await this.waitUntilElement(await this.getTransactionConfirmations(), 20000);
  }
}
