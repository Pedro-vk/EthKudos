import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

import { Page } from './page.abstract.po';
import * as helpers from '../helpers';

export class LandingHomePage extends Page {
  readonly getSections = helpers.getElementAll(by.css('section'));

  readonly getHeaderFaqsButton = helpers.getElementByDataQa('landing-home-footer-faqs');
  readonly getSectionDonateButton = helpers.getElementByDataQa('landing-home-footer-donate');
  readonly getFooterGithubButton = helpers.getElementByDataQa('landing-home-footer-github');
  readonly getFooterFaqsButton = helpers.getElementByDataQa('landing-home-footer-faqs');
  readonly getFooterAboutButton = helpers.getElementByDataQa('landing-home-footer-about');
  readonly getFooterPrivacyButton = helpers.getElementByDataQa('landing-home-footer-privacy');
  readonly getFooterDonateButton = helpers.getElementByDataQa('landing-home-footer-donate');

  readonly getJoinCard = helpers.getElementByDataQa('landing-home-join-card', 1000);
  readonly getNewOrgCard = helpers.getElementByDataQa('landing-home-new-org-card', 1000);
  readonly getCreatedOrgCard = helpers.getElementByDataQa('landing-home-created-org-card', 1000);

  readonly getCreateButton = helpers.getElementByDataQa('landing-home-button-create');
  readonly getJoinButton = helpers.getElementByDataQa('landing-home-button-join');

  readonly getJoinInput = helpers.getElementByDataQa('landing-home-join-input');
  readonly getJoinAutocompletions = helpers.getElementAllByDataQa('landing-home-join-autocomplete', 500);

  readonly getNewOrgNameInput = helpers.getElementByDataQa('landing-home-new-org-name');
  readonly getNewOrgTokenInput = helpers.getElementByDataQa('landing-home-new-org-token');
  readonly getNewOrgSymbolInput = helpers.getElementByDataQa('landing-home-new-org-symbol');
  readonly getNewOrgDecimalsInput = helpers.getElementByDataQa('landing-home-new-org-decimals');
  readonly getNewOrgDirectoryCheckbox = helpers.getElementByDataQa('landing-home-new-org-directory');
  readonly getNewOrgCreateButton = helpers.getElementByDataQa('landing-home-new-org-create');

  readonly getCreatedOrgContent = helpers.getElementByDataQa('landing-home-created-org-content', 2000);

  async navigateTo() {
    return await this.goToPath('/');
  }

  async getSection(sectionNumber: number): Promise<ElementFinder> {
    return (await this.getSections())[sectionNumber];
  }

  async getSectionContent(sectionNumber: number): Promise<{h2?: string, h3?: string, p?: string[]}> {
    await browser.sleep(200);
    const section: ElementFinder = await this.getSection(sectionNumber);
    const getTextOf = async (selector: string) => {
      const contentElem = section.element(by.css(selector));
      if (await browser.isElementPresent(contentElem)) {
        return await contentElem.getText();
      }
      return undefined;
    };

    const pContent = (<any>await helpers.getElementAll(by.css('p'), undefined, section)())
      .map(async(p: ElementFinder): Promise<string> => await p.getText());

    return {
      h2: await getTextOf('h2'),
      h3: await getTextOf('h3'),
      p: await Promise.all<string>(pContent),
    };
  }

  async setNewOrganizationForm(name: string, token: string, symbol: string, decimals: number, directory?: boolean) {
    await (await this.getNewOrgNameInput.waitUntil()).clear().sendKeys(name);
    await (await this.getNewOrgTokenInput.waitUntil()).clear().sendKeys(token);
    await (await this.getNewOrgSymbolInput.waitUntil()).clear().sendKeys(symbol);
    await (await this.getNewOrgDecimalsInput.waitUntil()).clear().sendKeys(String(decimals));
    if (directory) {
      await (await this.getNewOrgDirectoryCheckbox()).click();
    }
  }
}
