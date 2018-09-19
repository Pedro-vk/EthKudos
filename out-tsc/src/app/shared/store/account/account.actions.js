"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_ACCOUNT = 'account - set account';
exports.SET_BALANCE = 'account - set balance';
exports.ADD_NEW_TRANSACTION = 'account - new transaction';
exports.SET_TRANSACTION_METADATA = 'account - set transaction metadata';
exports.REMOVE_NEW_TRANSACTION = 'account - remove transaction';
exports.SET_TRANSACTION_CONFIRMATIONS = 'account - set transaction confirmations';
// Account data
var SetAccountAction = /** @class */ (function () {
    function SetAccountAction(payload) {
        this.payload = payload;
        this.type = exports.SET_ACCOUNT;
    }
    return SetAccountAction;
}());
exports.SetAccountAction = SetAccountAction;
var SetBalanceAction = /** @class */ (function () {
    function SetBalanceAction(payload) {
        this.payload = payload;
        this.type = exports.SET_BALANCE;
    }
    return SetBalanceAction;
}());
exports.SetBalanceAction = SetBalanceAction;
// Confirmations
var AddNewTransactionAction = /** @class */ (function () {
    function AddNewTransactionAction(payload) {
        this.payload = payload;
        this.type = exports.ADD_NEW_TRANSACTION;
    }
    return AddNewTransactionAction;
}());
exports.AddNewTransactionAction = AddNewTransactionAction;
var SetTransactionMetadataAction = /** @class */ (function () {
    function SetTransactionMetadataAction(tx, metadata) {
        this.type = exports.SET_TRANSACTION_METADATA;
        this.payload = { tx: tx, metadata: metadata };
    }
    return SetTransactionMetadataAction;
}());
exports.SetTransactionMetadataAction = SetTransactionMetadataAction;
var RemoveTransactionAction = /** @class */ (function () {
    function RemoveTransactionAction(payload) {
        this.payload = payload;
        this.type = exports.REMOVE_NEW_TRANSACTION;
    }
    return RemoveTransactionAction;
}());
exports.RemoveTransactionAction = RemoveTransactionAction;
var SetTransactionConfirmationsAction = /** @class */ (function () {
    function SetTransactionConfirmationsAction(tx, confirmations) {
        this.type = exports.SET_TRANSACTION_CONFIRMATIONS;
        this.payload = { tx: tx, confirmations: confirmations };
    }
    return SetTransactionConfirmationsAction;
}());
exports.SetTransactionConfirmationsAction = SetTransactionConfirmationsAction;
//# sourceMappingURL=account.actions.js.map