import { browser, by, element } from 'protractor';

export abstract class Page {

  abstract navigateTo(params?: string | number | {[param: string]: string | number}): Promise<any>;

  protected async goToPath(path: string, wait: number = 0) {
    await browser.waitForAngularEnabled(false);
    await browser.get(path);
    await browser.sleep(500 + wait);
  }
}
