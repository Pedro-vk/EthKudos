import { protractor, browser, by, element, ElementFinder, ElementArrayFinder, Locator, ExpectedConditions as until } from 'protractor';

// URL helpers
export async function getTitle() {
  return await browser.getTitle();
}
export async function getUrl() {
  return await browser.getCurrentUrl();
}
export async function getPath() {
  return (<string>await browser.getCurrentUrl()).replace(/^[^#]*?:\/\/.*?(\/.*)$/, '$1');
}
export async function getNewTabUrlAndClose() {
  const handles = await browser.getAllWindowHandles();
  browser.driver.switchTo().window(handles[1]);
  const url = await browser.getCurrentUrl();
  browser.driver.close();
  browser.driver.switchTo().window(handles[0]);
  return url;
}

// Key sedings
export async function sendEscKey() {
  return await (await element(by.css('body'))).sendKeys(protractor.Key.ESCAPE);
}

// Presence/visibility helpers
export async function isPresent(elementFinder: ElementFinder) {
  return <boolean>await browser.isElementPresent(elementFinder);
}
export async function isDisplayed(elementFinder: ElementFinder) {
  if (!await isPresent(elementFinder)) {
    return false;
  }
  return <boolean>await elementFinder.isDisplayed();
}

// Wait until helpers
export async function waitUntil(elementFinder: ElementFinder, timeout: number = 5000): Promise<ElementFinder> {
  await browser.wait(until.presenceOf(elementFinder), timeout, `Element '${elementFinder.locator()}' not found in DOM`);
  return <ElementFinder>elementFinder;
}
export async function waitUntilCss(selector: string, timeout: number = 5000): Promise<ElementFinder> {
  return await waitUntil(element(by.css(selector)), timeout);
}


// Element accessors helpers
type elementAccessor<T> = (() => Promise<T>) & {waitUntil: (delay?: number, skipUntil?: boolean) => Promise<T>};

function generateAccessor<T>(
  elementGetter: () => Promise<T>,
  locator: Locator,
  waitDelay: number = 0,
): elementAccessor<T> {
  const accessor: elementAccessor<T> = <any>(async() => await elementGetter());
  accessor.waitUntil = async(delay = 0, skipUntil = false) => {
    if (!skipUntil) {
      await waitUntilElement(locator)();
    }
    await browser.sleep(Math.max(waitDelay, delay));
    return await elementGetter();
  };
  return accessor;
}

export function getElement(locator: Locator, waitDelay?: number, ofElement?: ElementFinder) {
  const getter = async() => await (ofElement ? ofElement.element(locator) : element(locator));
  return generateAccessor<ElementFinder>(getter, locator, waitDelay);
}

export function getElementAll(locator: Locator, waitDelay?: number, ofElement?: ElementFinder) {
  const getter = async() => <any>await (ofElement ? ofElement.all(locator) : element.all(locator));
  return generateAccessor<ElementArrayFinder>(getter, locator, waitDelay);
}

export function waitUntilElement(locator: Locator, timeout: number = 5000, delay: number = 0) {
  return async(): Promise<ElementFinder> => {
    const e = await waitUntil(element(locator), timeout);
    await browser.sleep(delay);
    return e;
  };
}

// Data Qa accessors helpers
export function getElementByDataQa(dataQa: string, waitDelay: number = 0) {
  return getElement(by.css(`[data-qa="${dataQa}"]`), waitDelay);
}
export function getElementAllByDataQa(dataQa, waitDelay: number = 0) {
  return getElementAll(by.css(`[data-qa="${dataQa}"]`), waitDelay);
}
export function waitUntilElementByDataQa(dataQa, timeout: number = 5000, delay: number = 0) {
  return waitUntilElement(by.css(`[data-qa="${dataQa}"]`), timeout, delay);
}
