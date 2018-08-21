import { TestBed, inject } from '@angular/core/testing';
import * as Web3Module from 'web3';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/scan'; // tslint:disable-line
import 'rxjs/add/operator/share';

import { Web3Service, ConnectionStatus } from './web3.service';

describe('Web3Service', () => {
  const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;
  const newTx = n => `0x${'0'.repeat(65 - String(n).length)}${n}`;
  const toPromise = _ => new Promise(resolve => resolve(_));
  const toObservable = _ => _ === undefined ? Observable.of(undefined) : Observable.of(_);

  const account = newAccount(0);
  const blockNumber = 1000;
  const balance = 10 ** 17 + 123450000;

  let service: Web3Service;
  let intervalMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  beforeEach(inject([Web3Service], (web3Service: Web3Service) => {
    service = web3Service;
    (<any>service)._intervalMock = () => intervalMock;

    const web3 = new (<any>Web3Module)(<any>{});
    (<any>service)._web3 = {
      ...web3,
      eth: {
        ...web3.eth,
        getAccounts: jasmine.createSpy('getAccounts').and.returnValue(toPromise(([account]))),
        getBlockNumber: jasmine.createSpy('getBlockNumber').and.returnValue(toPromise((blockNumber))),
        getBalance: jasmine.createSpy('getBalance').and.callFake(_ => toPromise((String(_ === account ? balance : 0)))),
        getTransaction: jasmine.createSpy('getTransaction').and.callFake(hash => ({hash})),
        net: {
          ...web3.eth.net,
          getId: jasmine.createSpy('net.getId').and.returnValue(toPromise(1)),
        }
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

  it('should return current Ether balance', done => {
    service
      .getEthBalance()
      .first()
      .subscribe(_ => {
        expect(_).toBe(balance * 10 ** -18);
        done();
      });
  });

  it('should notify new blocks', () => {
    spyOn(service, 'getBlockNumber').and.returnValues(...[1000, 1000, 1001, 1001, 1002, 1002, 1002].map(toObservable));

    intervalMock =    hot('-x-x-x-x-x|', {x: undefined});
    const expected = cold('a--b---c--|', {a: 1000, b: 1001, c: 1002});

    expect(service.newBlock$).toBeObservable(expected);
  });

  it('should notify account changes', () => {
    spyOn(service, 'getAccount')
      .and.returnValues(
        ...[newAccount(10), newAccount(11), newAccount(11), newAccount(12), newAccount(12), newAccount(12)]
          .map(toObservable),
      );

    intervalMock =    hot('-x-x-x-x-x|', {x: undefined});
    const expected = cold('ab---c----|', {a: newAccount(10), b: newAccount(11), c: newAccount(12)});

    expect(service.account$).toBeObservable(expected);
  });

  it('should notify changes', () => {
    spyOn(service, 'getBlockNumber').and.returnValues(...[1000, 1000, 1000, 1000, 1001, 1001].map(toObservable));
    spyOn(service, 'getAccount')
      .and.returnValues(...[10, 10, 12, 12, 12, 12].map(newAccount).map(toObservable));

    intervalMock =    hot('-x---x-x-x-x|', {x: undefined});
    const expected = cold('(cc)-c---c--|', {c: undefined});

    expect(service.changes$).toBeObservable(expected);
  });

  it('should notify the status changes', () => {
    spyOn(service, 'getAccount')
      .and.returnValues(
        ...[undefined, undefined, undefined, newAccount(10), newAccount(10), newAccount(10), newAccount(10)]
          .map(toObservable),
      );


    const web3Backup = (<any>service)._web3;
    (<any>service)._web3 = undefined;
    (<any>service).existInNetwork = false;

    intervalMock =    hot('-x-x-x-x-x|', {x: undefined}).share();
    const expected = cold('p--a-n---t|', {
      n: ConnectionStatus.NoNetwork,
      p: ConnectionStatus.NoProvider,
      a: ConnectionStatus.NoAccount,
      t: ConnectionStatus.Total,
    });

    intervalMock
      .scan(acc => ++acc, 0)
      .subscribe(n => {
        switch (n) {
          case 2: (<any>service)._web3 = web3Backup; break;
          case 5: (<any>service).existInNetwork = true; break;
        }
      });

    expect(service.status$).toBeObservable(expected);
  });

  it('should keep the pending transactions', done => {
    const pTx = (tx, confirmations) => ({tx, confirmations, raw: {hash: tx}});
    const emitter = hot('-ab-(cd)-e--f|', {
      a: {tx: newTx('a00'), confirmations: 0},
      b: {tx: newTx('a00'), confirmations: 10},
      c: {tx: newTx('a00'), confirmations: 20},
      d: {tx: newTx('b11'), confirmations: 0},
      e: {tx: newTx('a00'), confirmations: 24},
      f: {tx: newTx('b11'), confirmations: 2},
    });
    const expected = [
      [pTx(newTx('a00'), 0)],
      [pTx(newTx('a00'), 10)],
      [pTx(newTx('a00'), 20)],
      [pTx(newTx('a00'), 20), pTx(newTx('b11'), 0)],
      [pTx(newTx('b11'), 0)],
      [pTx(newTx('b11'), 2)],
    ];

    service.activePendingTransactions$
      .subscribe(_ => {
        expect(_).toEqual(<any>expected.shift());
        if (!expected.length) {
          done();
        }
      });

    emitter
      .subscribe(({tx, confirmations}) => {
        service.newPendingTransaction(tx, confirmations);
      });
    getTestScheduler().flush();
  });
});
