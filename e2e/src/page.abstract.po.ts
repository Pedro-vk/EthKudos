import { browser, by, element, ExpectedConditions as until, ElementArrayFinder, ElementFinder } from 'protractor';

type elementGetterAndWaitable<T> = (() => Promise<T>) & {waitUntil: (delay?: number) => Promise<T>};

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

  async isPresent(elementFinder: ElementFinder): Promise<boolean> {
    return browser.isElementPresent(elementFinder);
  }

  protected async goToPath(path: string, wait: number = 0) {
    await browser.waitForAngularEnabled(false);
    await browser.get(path);
    await browser.sleep(wait);
  }

  protected async waitUntilElement(elementFinder: ElementFinder, timeout: number = 5000): Promise<ElementFinder> {
    await browser.wait(until.presenceOf(elementFinder), timeout, `Element '${elementFinder.locator()}' not found in DOM`);
    return elementFinder;
  }

  protected async waitUntilCss(selector: string, timeout: number = 5000) {
    return await this.waitUntilElement(element(by.css(selector)), timeout);
  }

  protected async getAllBySelector(selector: string, ofElement: ElementFinder = <any>element): Promise<ElementArrayFinder> {
    return <any>await (<any>ofElement.all)(by.css(selector));
  }

  protected dataQa(dataQa: string, waitDelay: number = 0): elementGetterAndWaitable<ElementFinder> {
    const promise: any = async(): Promise<ElementFinder> => await element(by.css(`[data-qa="${dataQa}"]`));
    promise.waitUntil = async(delay = 0): Promise<ElementFinder> => {
      const e = await this.dataQaWait(dataQa)();
      await browser.sleep(Math.max(waitDelay, delay));
      return <any>e;
    };
    return promise;
  }
  protected dataQaAll(dataQa: string, waitDelay: number = 0): elementGetterAndWaitable<ElementArrayFinder> {
    const promise: any = async(): Promise<ElementArrayFinder> => await this.getAllBySelector(`[data-qa="${dataQa}"]`);
    promise.waitUntil = async(delay = 0): Promise<ElementArrayFinder> => {
      await this.dataQaWait(dataQa)();
      await browser.sleep(Math.max(waitDelay, delay));
      return await <any>this.getAllBySelector(`[data-qa="${dataQa}"]`);
    };
    return promise;
  }
  protected dataQaWait(dataQa: string) {
    return async(): Promise<ElementFinder> => {
      return await this.waitUntilElement(element(by.css(`[data-qa="${dataQa}"]`)));
    };
  }
}
