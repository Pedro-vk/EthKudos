"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/combineLatest");
require("rxjs/add/observable/from");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/of");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/startWith");
require("rxjs/add/operator/takeWhile");
var web3_service_1 = require("../../web3.service");
var accountActions = require("./account.actions");
var AccountEffects = /** @class */ (function () {
    function AccountEffects(actions$, store, web3Service) {
        var _this = this;
        this.actions$ = actions$;
        this.store = store;
        this.web3Service = web3Service;
        this.watchAccountChanges$ = this.actions$
            .ofType(effects_1.ROOT_EFFECTS_INIT)
            .first()
            .mergeMap(function () { return _this.getWeb3Account(); })
            .map(function (account) { return new accountActions.SetAccountAction(account); });
        this.watchBalanceChanges$ = this.actions$
            .ofType(effects_1.ROOT_EFFECTS_INIT)
            .first()
            .mergeMap(function () { return _this.getWeb3Balance(); })
            .map(function (balance) { return new accountActions.SetBalanceAction(balance); });
        this.getMetadataOfNewTransactions$ = this.actions$
            .ofType(accountActions.ADD_NEW_TRANSACTION)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (tx) { return _this.web3Service.getTransaction(tx); })
            .map(function (transaction) { return _this.web3Service.getTransactionMetadata(transaction); })
            .filter(function (_) { return !!_; })
            .map(function (metadata) { return new accountActions.SetTransactionMetadataAction(metadata.hash, metadata); });
        this.removeTransactionOnConfirmations$ = this.actions$
            .ofType(accountActions.SET_TRANSACTION_CONFIRMATIONS)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .filter(function (_a) {
            var confirmations = _a.confirmations;
            return confirmations >= 24;
        })
            .map(function (_a) {
            var tx = _a.tx;
            return new accountActions.RemoveTransactionAction(tx);
        });
        this.txAdded = [];
        this.txRemoved = [];
        this.getPreviousPendingTransactions$ = this.actions$
            .ofType(accountActions.SET_ACCOUNT)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (account) {
            return _this.getCheckInterval()
                .filter(function () { return !!_this.web3Service.web3; })
                .mergeMap(function () { return _this.web3Service.getBlock('pending'); })
                .distinctUntilChanged(function (a, b) { return a.size === b.size; })
                .mergeMap(function () { return _this.web3Service.getBlock('pending', true); })
                .map(function (_a) {
                var transactions = _a.transactions;
                return transactions.filter(function (transaction) { return (transaction.from || '').toLowerCase() === (account || '').toLowerCase(); });
            })
                .map(function (transactions) { return transactions.map(function (tx) { return tx.hash; }); })
                .distinctUntilChanged(function (a, b) { return a.join('|') === b.join('|'); })
                .scan(function (acc, transactions) {
                return acc.concat(transactions).filter(function (tx, i, list) { return list.indexOf(tx) === i; })
                    .filter(function (_) { return !!_; });
            }, [])
                .mergeMap(function (txs) {
                return Observable_1.Observable
                    .combineLatest.apply(Observable_1.Observable, [Observable_1.Observable.of(undefined)].concat(txs.map(function (tx) { return _this.web3Service.getTransaction(tx); }))).map(function (transactions) { return transactions.filter(function (_) { return !!_; }); })
                    .map(function (transactions) { return ({ transactions: transactions, txs: txs }); });
            })
                .mergeMap(function (_a) {
                var transactions = _a.transactions, txs = _a.txs;
                var isRemoved = function (tx) { return !transactions.find(function (transaction) { return transaction && transaction.hash === tx; }); };
                var isAccepted = function (tx) { return !!transactions.find(function (transaction) { return transaction && transaction.hash === tx && !!transaction.blockNumber; }); };
                var actions = txs
                    .filter(function (tx) { return _this.txAdded.indexOf(tx) === -1; })
                    .map(function (tx) { return _this.txAdded.push(tx) && new accountActions.AddNewTransactionAction(tx); }).concat(txs
                    .filter(function (tx) { return _this.txRemoved.indexOf(tx) === -1; })
                    .filter(function (tx) { return isAccepted(tx) || isRemoved(tx); })
                    .map(function (tx) { return _this.txRemoved.push(tx) && new accountActions.RemoveTransactionAction(tx); }));
                if (txs.length === _this.txAdded.length && txs.length === _this.txRemoved.length) {
                    actions.push(false);
                }
                return Observable_1.Observable.from(actions);
            })
                .takeWhile(function (flag) { return flag !== false; });
        });
    }
    AccountEffects.prototype.getWeb3Account = function () {
        return this.web3Service.account$;
    };
    AccountEffects.prototype.getWeb3Balance = function () {
        return this.web3Service.ethBalance$;
    };
    AccountEffects.prototype.getCheckInterval = function () {
        return Observable_1.Observable
            .interval(1000 / 4)
            .startWith(undefined);
    };
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], AccountEffects.prototype, "watchAccountChanges$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], AccountEffects.prototype, "watchBalanceChanges$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], AccountEffects.prototype, "getMetadataOfNewTransactions$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], AccountEffects.prototype, "removeTransactionOnConfirmations$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], AccountEffects.prototype, "getPreviousPendingTransactions$", void 0);
    AccountEffects = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [effects_1.Actions, store_1.Store, web3_service_1.Web3Service])
    ], AccountEffects);
    return AccountEffects;
}());
exports.AccountEffects = AccountEffects;
//# sourceMappingURL=account.effects.js.map