import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

import { Page } from '../../page.abstract.po';

export class LandingHomePage extends Page {
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


  async getHeaderFaqsButton() {
    return await element(by.css('[data-qa="landing-home-footer-faqs"]'));
  }
  async getSectionDonateButton() {
    return await element(by.css('[data-qa="landing-home-footer-donate"]'));
  }
  async getFooterGithubButton() {
    return await element(by.css('[data-qa="landing-home-footer-github"]'));
  }
  async getFooterFaqsButton() {
    return await element(by.css('[data-qa="landing-home-footer-faqs"]'));
  }
  async getFooterAboutButton() {
    return await element(by.css('[data-qa="landing-home-footer-about"]'));
  }
  async getFooterPrivacyButton() {
    return await element(by.css('[data-qa="landing-home-footer-privacy"]'));
  }
  async getFooterDonateButton() {
    return await element(by.css('[data-qa="landing-home-footer-donate"]'));
  }
}
