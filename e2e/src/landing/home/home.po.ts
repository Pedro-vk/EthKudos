import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

import { Page } from '../../page.abstract.po';

export class LandingHomePage extends Page {
  readonly getHeaderFaqsButton = this.dataQa('landing-home-footer-faqs');
  readonly getSectionDonateButton = this.dataQa('landing-home-footer-donate');
  readonly getFooterGithubButton = this.dataQa('landing-home-footer-github');
  readonly getFooterFaqsButton = this.dataQa('landing-home-footer-faqs');
  readonly getFooterAboutButton = this.dataQa('landing-home-footer-about');
  readonly getFooterPrivacyButton = this.dataQa('landing-home-footer-privacy');
  readonly getFooterDonateButton = this.dataQa('landing-home-footer-donate');

  readonly getJoinCard = this.dataQa('landing-home-join-card', 1000);
  readonly getNewOrgCard = this.dataQa('landing-home-new-org-card', 1000);
  readonly getCreatedOrgCard = this.dataQa('landing-home-created-org-card', 1000);

  readonly getCreateButton = this.dataQa('landing-home-button-create');
  readonly getJoinButton = this.dataQa('landing-home-button-join');

  readonly getJoinInput = this.dataQa('landing-home-join-input');
  readonly getJoinAutocompletions = this.dataQaAll('landing-home-join-autocomplete');

  readonly getNewOrgNameInput = this.dataQa('landing-home-new-org-name');
  readonly getNewOrgTokenInput = this.dataQa('landing-home-new-org-token');
  readonly getNewOrgSymbolInput = this.dataQa('landing-home-new-org-symbol');
  readonly getNewOrgDecimalsInput = this.dataQa('landing-home-new-org-decimals');
  readonly getNewOrgDirectoryCheckbox = this.dataQa('landing-home-new-org-directory');
  readonly getNewOrgCreateButton = this.dataQa('landing-home-new-org-create');

  readonly getCreatedOrgContent = this.dataQa('landing-home-created-org-content', 2000);

  async navigateTo() {
    return await this.goToPath('/');
  }

  async getSections(): Promise<ElementArrayFinder> {
    return await <any>this.getAllBySelector('section');
  }

  async getSection(sectionNumber: number): Promise<ElementFinder> {
    return (await this.getSections())[sectionNumber];
  }

  async getSectionContent(sectionNumber: number): Promise<{h2?: string, h3?: string, p?: string[]}> {
    const section: ElementFinder = await this.getSection(sectionNumber);
    const getTextOf = async (selector: string) => {
      const contentElem = section.element(by.css(selector));
      if (await browser.isElementPresent(contentElem)) {
        return await contentElem.getText();
      }
      return undefined;
    };

    const pContent = (<any>await this.getAllBySelector('p', section))
      .map(async (p: ElementFinder): Promise<string> => await p.getText());

    return {
      h2: await getTextOf('h2'),
      h3: await getTextOf('h3'),
      p: await Promise.all<string>(pContent),
    };
  }

  async setNewOrganizationForm(name: string, token: string, symbol: string, decimals: number, directory?: boolean) {
    await (await this.getNewOrgNameInput()).clear().sendKeys(name);
    await (await this.getNewOrgTokenInput()).clear().sendKeys(token);
    await (await this.getNewOrgSymbolInput()).clear().sendKeys(symbol);
    await (await this.getNewOrgDecimalsInput()).clear().sendKeys(String(decimals));
    if (directory) {
      await (await this.getNewOrgDirectoryCheckbox()).click();
    }
  }
}
