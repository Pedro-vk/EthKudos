"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_BASIC_DATA = 'kudos token - load basic data';
exports.LOAD_TOTAL_DATA = 'kudos token - load total data';
exports.LOAD_ACCOUNT_BALANCE = 'kudos token - load account balance';
exports.SET_DATA = 'kudos token - set data';
exports.SET_BALANCE = 'kudos token - set balance';
// Load data
var LoadBasicDataAction = /** @class */ (function () {
    function LoadBasicDataAction(address, force) {
        if (force === void 0) { force = false; }
        this.type = exports.LOAD_BASIC_DATA;
        this.payload = { address: address, force: force };
    }
    return LoadBasicDataAction;
}());
exports.LoadBasicDataAction = LoadBasicDataAction;
var LoadTotalDataAction = /** @class */ (function () {
    function LoadTotalDataAction(address, force) {
        if (force === void 0) { force = false; }
        this.type = exports.LOAD_TOTAL_DATA;
        this.payload = { address: address, force: force };
    }
    return LoadTotalDataAction;
}());
exports.LoadTotalDataAction = LoadTotalDataAction;
var LoadAccountBalanceAction = /** @class */ (function () {
    function LoadAccountBalanceAction(address, account) {
        this.type = exports.LOAD_ACCOUNT_BALANCE;
        this.payload = { address: address, account: account };
    }
    return LoadAccountBalanceAction;
}());
exports.LoadAccountBalanceAction = LoadAccountBalanceAction;
// Set data
var SetTokenDataAction = /** @class */ (function () {
    function SetTokenDataAction(address, type, data) {
        this.type = exports.SET_DATA;
        this.payload = { address: address, type: type, data: data };
    }
    return SetTokenDataAction;
}());
exports.SetTokenDataAction = SetTokenDataAction;
var SetBalanceAction = /** @class */ (function () {
    function SetBalanceAction(address, account, balance) {
        this.type = exports.SET_BALANCE;
        this.payload = { address: address, account: account, balance: balance };
    }
    return SetBalanceAction;
}());
exports.SetBalanceAction = SetBalanceAction;
//# sourceMappingURL=kudos-token.actions.js.map