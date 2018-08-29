import { LandingHomePage } from '../pages/home.po';

import * as helpers from '../helpers';

describe('Organization creation', () => {
  let landingHomePage: LandingHomePage;

  beforeEach(() => {
    landingHomePage = new LandingHomePage();
  });

  it('should be able to access', async() => {
    await landingHomePage.navigateTo();
  });

  it('should have the joining card available', async() => {
    expect(await helpers.isPresent(await landingHomePage.getJoinCard.waitUntil())).toBeTruthy();
  });

  it('should be able to search the organization by address', async() => {
    expect(await helpers.isPresent(await landingHomePage.getJoinCard())).toBeTruthy();
    await (await landingHomePage.getJoinInput()).clear().sendKeys('0x');
    expect(await (await landingHomePage.getJoinInput()).getAttribute('value')).toBe('0x');
  });

  it('should create a new organization', async() => {
    await landingHomePage.navigateTo();

    (await landingHomePage.getCreateButton.waitUntil(100)).click();

    await landingHomePage.getNewOrgCard.waitUntil();
    await landingHomePage.getNewOrgNameInput.waitUntil();

    expect(await helpers.isPresent(await landingHomePage.getJoinCard())).toBeFalsy();
    expect(await helpers.isPresent(await landingHomePage.getNewOrgCard())).toBeTruthy();

    await landingHomePage.setNewOrganizationForm('Org e2e', 'OrgToken', 'e2e', 1);
    (await landingHomePage.getNewOrgCreateButton()).click();

    expect(await (await landingHomePage.getCreatedOrgContent.waitUntil(300)).getText()).toBe(`Org e2e\nLet's start\nopen`);
  });

  it('should create a new organization and add it on the directory', async() => {
    await landingHomePage.navigateTo();

    await (await landingHomePage.getJoinInput.waitUntil()).clear().sendKeys('0x');
    const orgsNumber = (await landingHomePage.getJoinAutocompletions.waitUntil(undefined, true)).length;

    await landingHomePage.navigateTo();

    (await landingHomePage.getCreateButton.waitUntil(300)).click();

    await landingHomePage.setNewOrganizationForm('Org e2e', 'OrgToken', 'e2e', 1, true);
    (await landingHomePage.getNewOrgCreateButton()).click();

    await landingHomePage.getCreatedOrgCard.waitUntil();

    await landingHomePage.navigateTo();

    await (await landingHomePage.getJoinInput.waitUntil()).clear().sendKeys('0x');
    expect((await landingHomePage.getJoinAutocompletions.waitUntil(200)).length).toBe(orgsNumber + 1);
  });
});
