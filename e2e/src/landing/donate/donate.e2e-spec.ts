/* tslint:disable:max-line-length */
import { LandingDonatePage } from './donate.po';

describe('Landing (Donate page)', () => {
  let page: LandingDonatePage;

  beforeEach(() => {
    page = new LandingDonatePage();
  });

  it('should be able to access', async() => {
    await page.navigateTo();
  });

  it('should have the correct title', async() => {
    expect(await page.getTitle()).toBe('EthKudos - Donate');
  });

  it('should have the donation default value of 0.01', async() => {
    expect(await (await page.getDonateInput()).getAttribute('value')).toBe('0.01');
  });

  it('should be able to change the donation value', async() => {
    expect(await (await page.getDonateInput()).getAttribute('value')).toBe('0.01');
    await (await page.getDonateInput()).clear().sendKeys('0.02');
    expect(await (await page.getDonateInput()).getAttribute('value')).toBe('0.02');
  });

  it('should be able to send transactions', async() => {
    expect(await page.isPresent(await page.getTransactionBlock())).toBeFalsy();
    await page.sendDonation();
    expect(await page.isPresent(await page.getTransactionBlock.waitUntil())).toBeTruthy();
    expect(await page.isPresent(await page.getTransactionConfirmations())).toBeFalsy();

    await page.waitForTransactionConfirmed();

    expect(await (await page.getTransactionCloseButton()).isEnabled()).toBeTruthy();
    expect(await page.isPresent(await page.getTransactionConfirmations())).toBeTruthy();
    expect(await (await page.getTransactionConfirmations()).getText()).toBe('check\n1');
    expect(await (await page.getTransactionCloseButton()).isEnabled()).toBeTruthy();
  });
});
