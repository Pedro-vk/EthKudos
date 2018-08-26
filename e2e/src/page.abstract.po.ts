import { browser, by, element, ExpectedConditions as until, ElementArrayFinder, ElementFinder } from 'protractor';

export abstract class Page {

  abstract navigateTo(params?: string | number | {[param: string]: string | number}): Promise<any>;

  async getTitle() {
    return await browser.getTitle();
  }

  async getUrl() {
    return await browser.getCurrentUrl();
  }

  async getPath() {
    return (<string>await browser.getCurrentUrl()).replace(/^[^#]*?:\/\/.*?(\/.*)$/, '$1');
  }

  async getNewTabUrlAndClose() {
    const handles = await browser.getAllWindowHandles();
    browser.driver.switchTo().window(handles[1]);
    const url = await browser.getCurrentUrl();
    browser.driver.close();
    browser.driver.switchTo().window(handles[0]);
    return url;
  }

  async isPresent(element: ElementFinder): Promise<boolean> {
    return browser.isElementPresent(element);
  }

  protected async goToPath(path: string) {
    await browser.waitForAngularEnabled(false);
    return await browser.get(path);
  }

  protected async waitUntilElement(element: ElementFinder, timeout: number = 5000): Promise<ElementFinder> {
    await browser.wait(until.presenceOf(element), timeout, `Element '${element.locator()}' not found in DOM`);
    return element;
  }

  protected async whiteUntilCss(selector: string, timeout: number = 5000) {
    return await this.waitUntilElement(element(by.css(selector)), timeout);
  }

  protected async getAllBySelector(selector: string, ofElement: ElementFinder = <any>element): Promise<ElementArrayFinder> {
    return <any>await (<any>ofElement.all)(by.css(selector));
  }
}
