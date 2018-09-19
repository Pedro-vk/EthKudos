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
var kudosTokenActions = require("./kudos-token.actions");
var initialState = {
    kudosTokens: {},
};
function kudosTokenReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b, _c, _d, _e;
    switch (action.type) {
        case kudosTokenActions.LOAD_BASIC_DATA:
        case kudosTokenActions.LOAD_TOTAL_DATA:
        case kudosTokenActions.LOAD_ACCOUNT_BALANCE: {
            var address = action.payload.address;
            return __assign({}, state, { kudosTokens: __assign({}, state.kudosTokens, (_a = {}, _a[address] = __assign({}, (state.kudosTokens[address] || {}), { loading: true, loaded: __assign({}, ((state.kudosTokens[address] || {}).loaded || {})) }), _a)) });
        }
        case kudosTokenActions.SET_DATA: {
            var _f = action.payload, address = _f.address, type = _f.type, data = _f.data;
            return __assign({}, state, { kudosTokens: __assign({}, state.kudosTokens, (_b = {}, _b[address] = __assign({}, (state.kudosTokens[address] || {}), { loading: false, loaded: __assign({}, ((state.kudosTokens[address] || {}).loaded || {}), (type ? (_c = {}, _c[type] = true, _c) : {})) }, data), _b)) });
        }
        case kudosTokenActions.SET_BALANCE: {
            var _g = action.payload, address = _g.address, account = _g.account, balance = _g.balance;
            return __assign({}, state, { kudosTokens: __assign({}, state.kudosTokens, (_d = {}, _d[address] = __assign({}, (state.kudosTokens[address] || {}), { loading: false, balances: __assign({}, (state.kudosTokens[address] || {}).balances, (_e = {}, _e[account] = balance, _e)) }), _d)) });
        }
        default: return state;
    }
}
exports.kudosTokenReducer = kudosTokenReducer;
/* tslint:disable:max-line-length */
exports.getKudosTokensById = function (state) { return state.kudosTokens; };
exports.getKudosTokens = function (state) { return Object.values(state.kudosTokens); };
// By id
exports.getKudosTokenByAddress = function (address) { return store_1.createSelector(exports.getKudosTokensById, function (state) {
    if (!state[address] || !state[address].loaded.basic) {
        return;
    }
    return __assign({}, state[address], { members: (state[address].members || []).map(function (member) { return ({ member: member, name: (state[address].contacts || {})[member] }); }) });
}); };
exports.getKudosTokenLoading = function (address) { return store_1.createSelector(exports.getKudosTokenByAddress(address), function (state) { return (state || {}).loading; }); };
exports.getKudosTokenLoaded = function (address) { return store_1.createSelector(exports.getKudosTokenByAddress(address), function (state) { return (state || {}).loaded; }); };
exports.getKudosTokenPolls = function (address) { return store_1.createSelector(exports.getKudosTokenByAddress(address), function (state) { return (state || {}).polls; }); };
exports.getKudosTokenPreviousPolls = function (address) { return store_1.createSelector(exports.getKudosTokenByAddress(address), function (state) { return state.polls.slice(0, -state.isActivePoll); }); };
exports.getKudosTokenActivePoll = function (address) { return store_1.createSelector(exports.getKudosTokenByAddress(address), function (state) { return state.isActivePoll ? state.polls[state.polls.length - 1] : undefined; }); };
//# sourceMappingURL=kudos-token.reducers.js.map