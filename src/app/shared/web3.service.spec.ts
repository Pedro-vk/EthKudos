import { TestBed, inject } from '@angular/core/testing';
import 'rxjs/add/operator/first';

import { Web3Service } from './web3.service';

describe('Web3Service', () => {
  const account = `0x${'0'.repeat(40)}`;
  const blockNumber = 1000;

  let service: Web3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  beforeEach(inject([Web3Service], (_: Web3Service) => {
    service = _;
    (<any>service)._web3 = {
      eth: {
        getAccounts: jasmine.createSpy('getAccounts').and.returnValue(new Promise(resolve => resolve([account]))),
        getBlockNumber: jasmine.createSpy('getBlockNumber').and.returnValue(new Promise(resolve => resolve(blockNumber))),
      },
    };
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should give a MetaMask installation link depending on the browser', () => {
    expect(service.getMetamaskInstallationLink('chrome'))
      .toBe('https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn');
    expect(service.getMetamaskInstallationLink('firefox'))
      .toBe('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/');
    expect(service.getMetamaskInstallationLink('opera'))
      .toBe('https://addons.opera.com/en/extensions/details/metamask/');
    expect(service.getMetamaskInstallationLink('default?'))
      .toBe('https://metamask.io/');
  });

  it('should return the current Web3 account', done => {
    service
      .getAccount()
      .first()
      .subscribe(_ => {
        expect(_).toBe(account);
        done();
      });
  });

  it('should return the last block number', done => {
    service
      .getBlockNumber()
      .first()
      .subscribe(_ => {
        expect(_).toBe(blockNumber);
        done();
      });
  });
});
