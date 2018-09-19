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
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var testing_2 = require("@ngrx/effects/testing");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var jasmine_marbles_1 = require("jasmine-marbles");
var __1 = require("../../");
var __2 = require("../");
var testing_utils_1 = require("../testing-utils");
var account_reducers_1 = require("./account.reducers");
var fromAccount = require("./account.reducers");
var accountActions = require("./account.actions");
var account_effects_1 = require("./account.effects");
var newAccount = function (n) { return "0x" + '0'.repeat(40 - String(n).length) + n; };
var newTx = function (n) { return "0x" + '0'.repeat(65 - String(n).length) + n; };
describe('Account - Reducers', function () {
    it('should be auto-initialized', function () {
        var finalState = testing_utils_1.reduceActions(account_reducers_1.accountReducer);
        expect(finalState).not.toBeUndefined();
    });
    it('should set the account', function () {
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.SetAccountAction(newAccount(1)),
            new accountActions.SetAccountAction(newAccount(2)),
            new accountActions.SetAccountAction(newAccount(3)),
        ], true);
        var account = steps.map(fromAccount.getAccount);
        expect(account).toEqual([
            undefined,
            newAccount(1),
            newAccount(2),
            newAccount(3),
        ]);
    });
    it('should set the balance', function () {
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.SetBalanceAction(1111),
            new accountActions.SetBalanceAction(2222),
            new accountActions.SetBalanceAction(3333),
        ], true);
        var balance = steps.map(fromAccount.getBalance);
        expect(balance).toEqual([
            0,
            1111,
            2222,
            3333,
        ]);
    });
    it('should add new transactions', function () {
        var _a, _b, _c;
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.AddNewTransactionAction(newTx(1)),
            new accountActions.AddNewTransactionAction(newTx(2)),
            new accountActions.AddNewTransactionAction(newTx(3)),
        ], true);
        var transactions = steps.map(fromAccount.getPendingTransactionsById);
        expect(transactions).toEqual([
            {},
            (_a = {}, _a[newTx(1)] = {}, _a),
            (_b = {}, _b[newTx(1)] = {}, _b[newTx(2)] = {}, _b),
            (_c = {}, _c[newTx(1)] = {}, _c[newTx(2)] = {}, _c[newTx(3)] = {}, _c),
        ]);
    });
    it('should remove transactions', function () {
        var _a, _b, _c;
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.AddNewTransactionAction(newTx(1)),
            new accountActions.AddNewTransactionAction(newTx(2)),
            new accountActions.RemoveTransactionAction(newTx(1)),
        ], true);
        var transactions = steps.map(fromAccount.getPendingTransactionsById);
        expect(transactions).toEqual([
            {},
            (_a = {}, _a[newTx(1)] = {}, _a),
            (_b = {}, _b[newTx(1)] = {}, _b[newTx(2)] = {}, _b),
            (_c = {}, _c[newTx(2)] = {}, _c),
        ]);
    });
    it('should add transactions metadata', function () {
        var _a, _b;
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.AddNewTransactionAction(newTx(1)),
            new accountActions.SetTransactionMetadataAction(newTx(1), { method: 'test' }),
        ], true);
        var transactions = steps.map(fromAccount.getPendingTransactionsById);
        expect(transactions).toEqual([
            {},
            (_a = {}, _a[newTx(1)] = {}, _a),
            (_b = {}, _b[newTx(1)] = { method: 'test' }, _b),
        ]);
    });
    it('should set confirmations to transactions', function () {
        var _a, _b;
        var steps = testing_utils_1.reduceActions(account_reducers_1.accountReducer, [
            new accountActions.AddNewTransactionAction(newTx(1)),
            new accountActions.SetTransactionConfirmationsAction(newTx(1), 10),
        ], true);
        var transactions = steps.map(fromAccount.getPendingTransactionsById);
        expect(transactions).toEqual([
            {},
            (_a = {}, _a[newTx(1)] = {}, _a),
            (_b = {}, _b[newTx(1)] = { confirmations: 10 }, _b),
        ]);
    });
});
describe('Account - Effects', function () {
    var store;
    var effects;
    var actions;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot(__assign({}, __2.reducers)),
            ],
            providers: __1.PROVIDERS.concat([
                account_effects_1.AccountEffects,
                testing_2.provideMockActions(function () { return actions; }),
            ]),
        });
        effects = testing_1.TestBed.get(account_effects_1.AccountEffects);
        store = testing_1.TestBed.get(store_1.Store);
    });
    it('should watch for account changes', function () {
        var fakeAddress = jasmine_marbles_1.cold('--a--b--c', {
            a: newAccount(1),
            b: newAccount(2),
            c: newAccount(3),
        });
        spyOn(effects, 'getWeb3Account').and.returnValue(fakeAddress);
        actions = jasmine_marbles_1.hot('-a', {
            a: { type: effects_1.ROOT_EFFECTS_INIT },
        });
        var expected = jasmine_marbles_1.cold('---a--b--c', {
            a: new accountActions.SetAccountAction(newAccount(1)),
            b: new accountActions.SetAccountAction(newAccount(2)),
            c: new accountActions.SetAccountAction(newAccount(3)),
        });
        expect(effects.watchAccountChanges$).toBeObservable(expected);
    });
    it('should watch for balance changes', function () {
        var fakeAddress = jasmine_marbles_1.cold('--a--b--c', {
            a: 1111,
            b: 2222,
            c: 3333,
        });
        spyOn(effects, 'getWeb3Balance').and.returnValue(fakeAddress);
        actions = jasmine_marbles_1.hot('-a', {
            a: { type: effects_1.ROOT_EFFECTS_INIT },
        });
        var expected = jasmine_marbles_1.cold('---a--b--c', {
            a: new accountActions.SetBalanceAction(1111),
            b: new accountActions.SetBalanceAction(2222),
            c: new accountActions.SetBalanceAction(3333),
        });
        expect(effects.watchBalanceChanges$).toBeObservable(expected);
    });
    it('should get the metadata of a transaction', function () {
        spyOn(effects.web3Service, 'getTransaction').and.callFake(function (hash) { return Observable_1.Observable.of({ hash: hash }); });
        spyOn(effects.web3Service, 'getTransactionMetadata').and.callFake(function (transaction) { return (__assign({}, transaction, { method: 'test' })); });
        actions = jasmine_marbles_1.hot('-a-b', {
            a: new accountActions.AddNewTransactionAction(newTx(1)),
            b: new accountActions.AddNewTransactionAction(newTx(2)),
        });
        var expected = jasmine_marbles_1.cold('-a-b', {
            a: new accountActions.SetTransactionMetadataAction(newTx(1), { method: 'test', hash: newTx(1) }),
            b: new accountActions.SetTransactionMetadataAction(newTx(2), { method: 'test', hash: newTx(2) }),
        });
        expect(effects.getMetadataOfNewTransactions$).toBeObservable(expected);
    });
    it('should remove a transaction when have 24 confirmations', function () {
        actions = jasmine_marbles_1.hot('-a-b-f', {
            a: new accountActions.SetTransactionConfirmationsAction(newTx(1), 10),
            b: new accountActions.SetTransactionConfirmationsAction(newTx(1), 20),
            f: new accountActions.SetTransactionConfirmationsAction(newTx(1), 24),
        });
        var expected = jasmine_marbles_1.cold('-----r', {
            r: new accountActions.RemoveTransactionAction(newTx(1)),
        });
        expect(effects.removeTransactionOnConfirmations$).toBeObservable(expected);
    });
    it('should get the pending transactions from web3', function () {
        var _a;
        var checkInterval = jasmine_marbles_1.hot('-i-i-i-i---i-i-i-i-i-i-i-i---i-i', {
            i: undefined,
        });
        effects.web3Service._web3 = true;
        spyOn(effects, 'getCheckInterval').and.returnValue(checkInterval);
        var transactionsRaw = (_a = {},
            _a[newTx(1)] = { from: newAccount(1), hash: newTx(1) },
            _a[newTx(2)] = { from: newAccount(1), hash: newTx(2) },
            _a[newTx(3)] = { from: newAccount(1), hash: newTx(3) },
            _a[newTx(4)] = { from: newAccount(1), hash: newTx(4) },
            _a[newTx(5)] = { from: newAccount(1), hash: newTx(5) },
            _a);
        var transactions = {};
        var transactionsList = Object.values(transactionsRaw);
        var blockNumber = 0;
        spyOn(effects.web3Service, 'getTransaction').and.callFake(function (tx) { return Observable_1.Observable.of(transactions[tx]); });
        spyOn(effects.web3Service, 'getBlock').and.callFake(function () {
            var block;
            var setTransactions = function (txsList) { return transactions = txsList.reduce(function (acc, _) {
                var _a;
                return (__assign({}, acc, (_a = {}, _a[_.hash] = _, _a)));
            }, {}); };
            var setBlock = function (txsList, size) { return block = { size: size, transactions: txsList }; };
            var setTxs = function (txsList, size) {
                setTransactions(txsList);
                setBlock(txsList, size);
            };
            if (blockNumber <= 2) {
                setTxs(transactionsList.slice(0, 4), 4);
            }
            else if (blockNumber <= 4) {
                setTxs(transactionsList.slice(0, 4), 41);
            }
            else if (blockNumber <= 12) {
                setTxs(transactionsList.slice(0, 2), 2);
            }
            else if (blockNumber <= 15) {
                setTxs(transactionsList.slice(1, 2).concat([transactionsList[4]]), 11);
            }
            else {
                setTxs([], 0);
            }
            blockNumber++;
            return Observable_1.Observable.of(block);
        });
        actions = jasmine_marbles_1.hot('-a', {
            a: new accountActions.SetAccountAction(newAccount(1)),
        });
        var expected = jasmine_marbles_1.cold('---(abcd)--(xy)----------(ev)--(wz)', {
            a: new accountActions.AddNewTransactionAction(newTx(1)),
            b: new accountActions.AddNewTransactionAction(newTx(2)),
            c: new accountActions.AddNewTransactionAction(newTx(3)),
            d: new accountActions.AddNewTransactionAction(newTx(4)),
            e: new accountActions.AddNewTransactionAction(newTx(5)),
            v: new accountActions.RemoveTransactionAction(newTx(1)),
            w: new accountActions.RemoveTransactionAction(newTx(2)),
            x: new accountActions.RemoveTransactionAction(newTx(3)),
            y: new accountActions.RemoveTransactionAction(newTx(4)),
            z: new accountActions.RemoveTransactionAction(newTx(5)),
        });
        expect(effects.getPreviousPendingTransactions$).toBeObservable(expected);
    });
});
//# sourceMappingURL=account.spec.js.map