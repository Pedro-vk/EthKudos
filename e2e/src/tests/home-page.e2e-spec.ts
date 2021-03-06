/* tslint:disable:max-line-length */
import { LandingHomePage } from '../pages/home.po';

import * as helpers from '../helpers';

describe('Landing page', () => {
  let page: LandingHomePage;

  beforeEach(() => {
    page = new LandingHomePage();
  });

  it('should be able to access', async() => {
    await page.navigateTo();
  });

  it('should have the correct title', async() => {
    expect(await helpers.getTitle()).toBe('EthKudos - Time to reward');
  });

  it('should display 4 sections', async() => {
    expect((await page.getSections()).length).toBe(4);
  });

  it('should have the first section showing the correct content', async() => {
    expect(await page.getSectionContent(0)).toEqual({
      h2: 'Connecting coworkers',
      h3: 'Join an organisation',
      p: [
        'EthKudos provides an opportunity of gratifying the team collaboration.',
        'Each member rewards people who helped him or her,\nencouraging and recognizing team cooperation between members.',
      ],
    });
  });

  it('should have the second section showing the correct content', async() => {
    expect(await page.getSectionContent(1)).toEqual({
      h2: 'Your organisation or team, your token',
      h3: 'The more Kudos a member  receives, the more prestige',
      p: [
        'Each member will have some kudos to reward other coworkers,\nsending a message that will be seen by the receivers.',
        'There is a limit of kudos sendings, which ensures that all the\nmembers respect the rules and promote gratitude between members.',
      ],
    });
  });

  it('should have the third section showing the correct content', async() => {
    expect(await page.getSectionContent(2)).toEqual({
      h2: 'Polling time! Time to reward!',
      h3: 'The members are sending gratitude to people that have helped',
      p: [
        'Each message will increase motivation and improve the team\'s relationship,\nthe team cooperation won\'t be forgotten.',
        'Your organisation is able to use the polling data to gratify the members.\nSo, wouldn\'t you like to have EthKudos on your team?',
      ],
    });
  });

  it('should have the fourth section showing the correct content', async() => {
    expect(await page.getSectionContent(3)).toEqual({
      h2: 'Why beta? Why ropsten*?',
      h3: 'We want to improve EthKudos, we need your feedback!',
      p: [
        'You can give us your feedback on GitHub.\nTell us how is your team using EthKudos and what are you missing.',
        'Help us to speed up the deployment on Ethereum main network.\nCreate your organisation, give us some feedback and donate some Ether.',
      ],
    });
  });

  it('should go to FAQs page clicking on header help icon', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getHeaderFaqsButton()).click();
    expect(await helpers.getPath()).toBe('/faqs');
  });

  it('should go to donation page clicking on support the project section', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getSectionDonateButton()).click();
    expect(await helpers.getPath()).toBe('/donate');
  });

  it('should go to GitHub clicking on footer GitHub button', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getFooterGithubButton()).click();
    expect(await helpers.getNewTabUrlAndClose()).toBe('https://github.com/Pedro-vk/EthKudos');
  });

  it('should go to FAQs page clicking on footer FAQs button', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getFooterFaqsButton()).click();
    expect(await helpers.getPath()).toBe('/faqs');
  });

  it('should go to About page clicking on footer About button', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getFooterAboutButton()).click();
    expect(await helpers.getPath()).toBe('/about');
  });

  it('should go to Privacy Policy page clicking on footer Privacy Policy button', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getFooterPrivacyButton()).click();
    expect(await helpers.getPath()).toBe('/privacy-policy');
  });

  it('should go to Donate page clicking on footer Donate button', async() => {
    await page.navigateTo();
    expect(await helpers.getPath()).toBe('/');
    await (await page.getFooterDonateButton()).click();
    expect(await helpers.getPath()).toBe('/donate');
  });
});
