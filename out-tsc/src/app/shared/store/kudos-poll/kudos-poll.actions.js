"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_BASIC_DATA = 'kudos poll - load basic data';
exports.LOAD_DYNAMIC_DATA = 'kudos poll - load dynamic data';
exports.LOAD_ACCOUNT_GRATITUDES = 'kudos poll - load account gratitudes';
exports.SET_DATA = 'kudos poll - set data';
exports.SET_BALANCE = 'kudos poll - set balance';
exports.SET_GRATITUDES = 'kudos poll - set gratitudes';
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
var LoadDynamicDataAction = /** @class */ (function () {
    function LoadDynamicDataAction(address, force) {
        if (force === void 0) { force = false; }
        this.type = exports.LOAD_DYNAMIC_DATA;
        this.payload = { address: address, force: force };
    }
    return LoadDynamicDataAction;
}());
exports.LoadDynamicDataAction = LoadDynamicDataAction;
var LoadAccountGratitudesAction = /** @class */ (function () {
    function LoadAccountGratitudesAction(address, account) {
        this.type = exports.LOAD_ACCOUNT_GRATITUDES;
        this.payload = { address: address, account: account };
    }
    return LoadAccountGratitudesAction;
}());
exports.LoadAccountGratitudesAction = LoadAccountGratitudesAction;
// Set data
var SetPollDataAction = /** @class */ (function () {
    function SetPollDataAction(address, type, data) {
        this.type = exports.SET_DATA;
        this.payload = { address: address, type: type, data: data };
    }
    return SetPollDataAction;
}());
exports.SetPollDataAction = SetPollDataAction;
var SetBalanceAction = /** @class */ (function () {
    function SetBalanceAction(address, account, balance) {
        this.type = exports.SET_BALANCE;
        this.payload = { address: address, account: account, balance: balance };
    }
    return SetBalanceAction;
}());
exports.SetBalanceAction = SetBalanceAction;
var SetGratitudesAction = /** @class */ (function () {
    function SetGratitudesAction(address, account, gratitudes) {
        this.type = exports.SET_GRATITUDES;
        this.payload = { address: address, account: account, gratitudes: gratitudes };
    }
    return SetGratitudesAction;
}());
exports.SetGratitudesAction = SetGratitudesAction;
//# sourceMappingURL=kudos-poll.actions.js.map