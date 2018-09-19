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
var store_1 = require("@ngrx/store");
var kudosPollActions = require("./kudos-poll.actions");
var initialState = {
    kudosPolls: {},
};
function kudosPollReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b, _c, _d, _e, _f, _g;
    switch (action.type) {
        case kudosPollActions.LOAD_BASIC_DATA:
        case kudosPollActions.LOAD_DYNAMIC_DATA:
        case kudosPollActions.LOAD_ACCOUNT_GRATITUDES: {
            var address = action.payload.address;
            return __assign({}, state, { kudosPolls: __assign({}, state.kudosPolls, (_a = {}, _a[address] = __assign({}, (state.kudosPolls[address] || {}), { loading: true, loaded: __assign({}, ((state.kudosPolls[address] || {}).loaded || {})) }), _a)) });
        }
        case kudosPollActions.SET_DATA: {
            var _h = action.payload, address = _h.address, type = _h.type, data = _h.data;
            return __assign({}, state, { kudosPolls: __assign({}, state.kudosPolls, (_b = {}, _b[address] = __assign({}, (state.kudosPolls[address] || {}), { loading: false, loaded: __assign({}, ((state.kudosPolls[address] || {}).loaded || {}), (type ? (_c = {}, _c[type] = true, _c) : {})) }, data), _b)) });
        }
        case kudosPollActions.SET_BALANCE: {
            var _j = action.payload, address = _j.address, account = _j.account, balance = _j.balance;
            return __assign({}, state, { kudosPolls: __assign({}, state.kudosPolls, (_d = {}, _d[address] = __assign({}, (state.kudosPolls[address] || {}), { loading: false, balances: __assign({}, (state.kudosPolls[address] || {}).balances, (_e = {}, _e[account] = balance, _e)) }), _d)) });
        }
        case kudosPollActions.SET_GRATITUDES: {
            var _k = action.payload, address = _k.address, account = _k.account, gratitudes = _k.gratitudes;
            return __assign({}, state, { kudosPolls: __assign({}, state.kudosPolls, (_f = {}, _f[address] = __assign({}, (state.kudosPolls[address] || {}), { loading: false, gratitudes: __assign({}, (state.kudosPolls[address] || {}).gratitudes, (_g = {}, _g[account] = gratitudes, _g)) }), _f)) });
        }
        default: return state;
    }
}
exports.kudosPollReducer = kudosPollReducer;
/* tslint:disable:max-line-length */
exports.getKudosPollsById = function (state) { return state.kudosPolls; };
exports.getKudosPolls = function (state) { return Object.values(state.kudosPolls); };
// By id
exports.getKudosPollByAddress = function (address) { return store_1.createSelector(exports.getKudosPollsById, function (state) {
    if (!state[address] || !state[address].loaded.basic) {
        return;
    }
    return state[address];
}); };
exports.getKudosPollLoading = function (address) { return store_1.createSelector(exports.getKudosPollByAddress(address), function (state) { return (state || {}).loading; }); };
exports.getKudosPollLoaded = function (address) { return store_1.createSelector(exports.getKudosPollByAddress(address), function (state) { return (state || {}).loaded; }); };
//# sourceMappingURL=kudos-poll.reducers.js.map