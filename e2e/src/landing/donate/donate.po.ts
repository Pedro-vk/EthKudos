import { browser, by, element, ElementFinder, ElementArrayFinder, ExpectedConditions as until } from 'protractor';

import { Page } from '../../page.abstract.po';

export class LandingDonatePage extends Page {
  async navigateTo() {
    await browser.sleep(20);
    await this.goToPath('/donate');
  }

  async sendDonation() {
    (await this.getDonateButton()).click();
    await this.waitUntilElement(await this.getTransactionBlock());
  }

  async getDonateInput() {
    return element(by.css('[data-qa="landing-donate-input-donate"]'));
  }
  async getDonateButton() {
    return element(by.css('[data-qa="landing-donate-make-donate"]'));
  }

  async getTransactionBlock() {
    return element(by.css('[data-qa="landing-donate-tx-block"]'));
  }
  async getTransactionConfirmations() {
    return element(by.css('[data-qa="landing-donate-tx-confirmations"]'));
  }
  async getTransactionCloseButton() {
    return element(by.css('[data-qa="landing-donate-tx-close"]'));
  }

  async waitForTransactionConfirmed() {
    return await this.waitUntilElement(await this.getTransactionConfirmations(), 20000);
  }
}
