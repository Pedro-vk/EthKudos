"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var Web3Module = require("web3");
var jasmine_marbles_1 = require("jasmine-marbles");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/first");
require("rxjs/add/operator/scan"); // tslint:disable-line
require("rxjs/add/operator/share");
var web3_service_1 = require("./web3.service");
describe('Web3Service', function () {
    var newAccount = function (n) { return "0x" + '0'.repeat(40 - String(n).length) + n; };
    var newTx = function (n) { return "0x" + '0'.repeat(65 - String(n).length) + n; };
    var toPromise = function (_) { return new Promise(function (resolve) { return resolve(_); }); };
    var toObservable = function (_) { return _ === undefined ? Observable_1.Observable.of(undefined) : Observable_1.Observable.of(_); };
    var account = newAccount(0);
    var blockNumber = 1000;
    var balance = Math.pow(10, 17) + 123450000;
    var service;
    var intervalMock;
    beforeEach(function () {
        spyOn(web3_service_1.Web3Service.prototype, 'listenChanges');
        testing_1.TestBed.configureTestingModule({
            providers: [web3_service_1.Web3Service]
        });
    });
    beforeEach(testing_1.inject([web3_service_1.Web3Service], function (web3Service) {
        service = web3Service;
        service._intervalMock = function () { return intervalMock; };
        var web3 = new Web3Module({});
        service._web3 = __assign({}, web3, { eth: __assign({}, web3.eth, { getAccounts: jasmine.createSpy('getAccounts').and.returnValue(toPromise(([account]))), getBlockNumber: jasmine.createSpy('getBlockNumber').and.returnValue(toPromise((blockNumber))), getBalance: jasmine.createSpy('getBalance').and.callFake(function (_) { return toPromise((String(_ === account ? balance : 0))); }), getTransaction: jasmine.createSpy('getTransaction').and.callFake(function (hash) { return ({ hash: hash }); }), net: __assign({}, web3.eth.net, { getId: jasmine.createSpy('net.getId').and.returnValue(toPromise(1)) }) }) });
    }));
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    it('should give a MetaMask installation link depending on the browser', function () {
        expect(service.getMetamaskInstallationLink('chrome'))
            .toBe('https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn');
        expect(service.getMetamaskInstallationLink('firefox'))
            .toBe('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/');
        expect(service.getMetamaskInstallationLink('opera'))
            .toBe('https://addons.opera.com/en/extensions/details/metamask/');
        expect(service.getMetamaskInstallationLink('default?'))
            .toBe('https://metamask.io/');
    });
    it('should return the current Web3 account', function (done) {
        service
            .getAccount()
            .first()
            .subscribe(function (_) {
            expect(_).toBe(account);
            done();
        });
    });
    it('should return the last block number', function (done) {
        service
            .getBlockNumber()
            .first()
            .subscribe(function (_) {
            expect(_).toBe(blockNumber);
            done();
        });
    });
    it('should return current Ether balance', function (done) {
        service
            .getEthBalance()
            .first()
            .subscribe(function (_) {
            expect(_).toBe(balance * Math.pow(10, -18));
            done();
        });
    });
    it('should notify new blocks', function () {
        var _a;
        (_a = spyOn(service, 'getBlockNumber').and).returnValues.apply(_a, [1000, 1000, 1001, 1001, 1002, 1002, 1002].map(toObservable));
        intervalMock = jasmine_marbles_1.hot('-x-x-x-x-x|', { x: undefined });
        var expected = jasmine_marbles_1.cold('a--b---c--|', { a: 1000, b: 1001, c: 1002 });
        expect(service.newBlock$).toBeObservable(expected);
    });
    it('should notify account changes', function () {
        var _a;
        (_a = spyOn(service, 'getAccount')
            .and).returnValues.apply(_a, [newAccount(10), newAccount(11), newAccount(11), newAccount(12), newAccount(12), newAccount(12)]
            .map(toObservable));
        intervalMock = jasmine_marbles_1.hot('-x-x-x-x-x|', { x: undefined });
        var expected = jasmine_marbles_1.cold('ab---c----|', { a: newAccount(10), b: newAccount(11), c: newAccount(12) });
        expect(service.account$).toBeObservable(expected);
    });
    it('should notify changes', function () {
        var _a, _b;
        (_a = spyOn(service, 'getBlockNumber').and).returnValues.apply(_a, [1000, 1000, 1000, 1000, 1001, 1001].map(toObservable));
        (_b = spyOn(service, 'getAccount')
            .and).returnValues.apply(_b, [10, 10, 12, 12, 12, 12].map(newAccount).map(toObservable));
        intervalMock = jasmine_marbles_1.hot('-x---x-x-x-x|', { x: undefined });
        var expected = jasmine_marbles_1.cold('(cc)-c---c--|', { c: undefined });
        expect(service.changes$).toBeObservable(expected);
    });
    it('should notify the status changes', function () {
        var _a;
        (_a = spyOn(service, 'getAccount')
            .and).returnValues.apply(_a, [undefined, undefined, undefined, newAccount(10), newAccount(10), newAccount(10), newAccount(10)]
            .map(toObservable));
        var web3Backup = service._web3;
        service._web3 = undefined;
        service.existInNetwork = false;
        intervalMock = jasmine_marbles_1.hot('-x-x-x-x-x|', { x: undefined }).share();
        var expected = jasmine_marbles_1.cold('p--a-n---t|', {
            n: web3_service_1.ConnectionStatus.NoNetwork,
            p: web3_service_1.ConnectionStatus.NoProvider,
            a: web3_service_1.ConnectionStatus.NoAccount,
            t: web3_service_1.ConnectionStatus.Total,
        });
        intervalMock
            .scan(function (acc) { return ++acc; }, 0)
            .subscribe(function (n) {
            switch (n) {
                case 2:
                    service._web3 = web3Backup;
                    break;
                case 5:
                    service.existInNetwork = true;
                    break;
            }
        });
        expect(service.status$).toBeObservable(expected);
    });
    it('should notify a contract change', function () {
        var _a, _b;
        (_a = spyOn(service, 'getBlockNumber').and).returnValues.apply(_a, [1000, 1000, 1001, 1001, 1002, 1002].map(toObservable));
        (_b = spyOn(service, 'getBlock').and).returnValues.apply(_b, [
            { transactions: [{ to: newAccount(100) }, { to: newAccount(101) }, { to: newAccount(102) }] },
            { transactions: [{ to: newAccount(103) }] },
            { transactions: [{ to: newAccount(100) }, { to: newAccount(900) }, { to: newAccount(102) }] },
        ].map(toObservable));
        intervalMock = jasmine_marbles_1.hot('-x-x-x-x|', { x: undefined });
        var expected = jasmine_marbles_1.cold('-------c', { c: newAccount(900) });
        expect(service.watchContractChanges(newAccount(900))).toBeObservable(expected);
    });
});
//# sourceMappingURL=web3.service.spec.js.map