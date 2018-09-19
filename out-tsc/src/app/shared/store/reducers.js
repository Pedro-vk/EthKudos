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
var router_store_1 = require("@ngrx/router-store");
var account_reducers_1 = require("./account/account.reducers");
var kudos_poll_reducers_1 = require("./kudos-poll/kudos-poll.reducers");
var kudos_token_reducers_1 = require("./kudos-token/kudos-token.reducers");
var status_reducers_1 = require("./status/status.reducers");
var fromAccount = require("./account/account.reducers");
var fromKudosPoll = require("./kudos-poll/kudos-poll.reducers");
var fromKudosToken = require("./kudos-token/kudos-token.reducers");
var fromStatus = require("./status/status.reducers");
exports.reducers = {
    accountReducer: account_reducers_1.accountReducer,
    kudosPollReducer: kudos_poll_reducers_1.kudosPollReducer,
    kudosTokenReducer: kudos_token_reducers_1.kudosTokenReducer,
    routerReducer: router_store_1.routerReducer,
    statusReducer: status_reducers_1.statusReducer,
};
/* tslint:disable:max-line-length */
// Root selectors
exports.getAccountState = function (state) { return state.accountReducer; };
exports.getKudosPollState = function (state) { return state.kudosPollReducer; };
exports.getKudosTokenState = function (state) { return state.kudosTokenReducer; };
exports.getRouterState = function (state) { return state.routerReducer; };
exports.getStatusState = function (state) { return state.statusReducer; };
// Account
exports.getAccount = store_1.createSelector(exports.getAccountState, fromAccount.getAccount);
exports.getBalance = store_1.createSelector(exports.getAccountState, fromAccount.getBalance);
exports.getPendingTransactionsById = store_1.createSelector(exports.getAccountState, fromAccount.getPendingTransactionsById);
exports.getPendingTransactions = store_1.createSelector(exports.getAccountState, fromAccount.getPendingTransactions);
// KudosPoll
exports.getKudosPollsById = store_1.createSelector(exports.getKudosPollState, fromKudosPoll.getKudosPollsById);
exports.getKudosPolls = store_1.createSelector(exports.getKudosPollState, fromKudosPoll.getKudosPolls);
exports.getKudosPollByAddress = function (address) { return store_1.createSelector(exports.getKudosPollState, fromKudosPoll.getKudosPollByAddress(address)); };
exports.getKudosPollLoading = function (address) { return store_1.createSelector(exports.getKudosPollState, fromKudosPoll.getKudosPollLoading(address)); };
exports.getKudosPollLoaded = function (address) { return store_1.createSelector(exports.getKudosPollState, fromKudosPoll.getKudosPollLoaded(address)); };
// KudosToken
exports.getKudosTokensById = store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokensById);
exports.getKudosTokens = store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokens);
exports.getKudosTokenByAddress = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenByAddress(address)); };
exports.getKudosTokenLoading = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenLoading(address)); };
exports.getKudosTokenLoaded = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenLoaded(address)); };
exports.getKudosTokenPolls = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenPolls(address)); };
exports.getKudosTokenPreviousPolls = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenPreviousPolls(address)); };
exports.getKudosTokenActivePoll = function (address) { return store_1.createSelector(exports.getKudosTokenState, fromKudosToken.getKudosTokenActivePoll(address)); };
// Status
exports.getStatus = store_1.createSelector(exports.getStatusState, fromStatus.getStatus);
// Mixes
// Account + KudosPoll
exports.getKudosPollByAddressWithAccountData = function (address) { return store_1.createSelector(exports.getAccount, exports.getKudosPollByAddress(address), function (account, kudosPoll) { return kudosPoll && (__assign({}, kudosPoll, { imMember: !!(kudosPoll.members || []).find(function (member) { return member === account; }), myBalance: ((kudosPoll.balances || {})[account] || 0) / Math.pow(10, kudosPoll.decimals) })); }); };
// Account + KudosToken
exports.getKudosTokenByAddressWithAccountData = function (address) { return store_1.createSelector(exports.getAccount, exports.getKudosTokenByAddress(address), function (account, kudosToken) { return kudosToken && (__assign({}, kudosToken, { imOwner: kudosToken.owner && kudosToken.owner === account, imMember: !!(kudosToken.members || []).find(function (_a) {
        var member = _a.member;
        return member === account;
    }), myBalance: ((kudosToken.balances || {})[account] || 0) / Math.pow(10, kudosToken.decimals), myContact: kudosToken.contacts && kudosToken.contacts[account] })); }); };
// Account + KudosToken + router
exports.getCurrentKudosTokenWithAccountData = store_1.createSelector(exports.getRouterState, function (_) { return _; }, function (router, state) {
    if (router && router.state.root.firstChild && router.state.root.firstChild.params.tokenAddress) {
        return exports.getKudosTokenByAddressWithAccountData(router.state.root.firstChild.params.tokenAddress)(state);
    }
});
//# sourceMappingURL=reducers.js.map