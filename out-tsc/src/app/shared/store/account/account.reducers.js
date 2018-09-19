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
var accountActions = require("./account.actions");
var initialState = {
    account: undefined,
    balance: 0,
    pendingTransactions: {},
};
function accountReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a, _b, _c;
    switch (action.type) {
        case accountActions.SET_ACCOUNT: {
            return __assign({}, state, { account: action.payload, pendingTransactions: {} });
        }
        case accountActions.SET_BALANCE: {
            return __assign({}, state, { balance: action.payload });
        }
        case accountActions.ADD_NEW_TRANSACTION: {
            var tx = action.payload;
            return __assign({}, state, { pendingTransactions: __assign({}, state.pendingTransactions, (_a = {}, _a[tx] = __assign({}, (state.pendingTransactions[tx] || {})), _a)) });
        }
        case accountActions.SET_TRANSACTION_METADATA: {
            var _d = action.payload, tx = _d.tx, metadata = _d.metadata;
            return __assign({}, state, { pendingTransactions: __assign({}, state.pendingTransactions, (_b = {}, _b[tx] = __assign({}, (state.pendingTransactions[tx] || {}), metadata), _b)) });
        }
        case accountActions.REMOVE_NEW_TRANSACTION: {
            var tx = action.payload;
            var pendingTransactions = __assign({}, state.pendingTransactions);
            delete pendingTransactions[tx];
            return __assign({}, state, { pendingTransactions: pendingTransactions });
        }
        case accountActions.SET_TRANSACTION_CONFIRMATIONS: {
            var _e = action.payload, tx = _e.tx, confirmations = _e.confirmations;
            return __assign({}, state, { pendingTransactions: __assign({}, state.pendingTransactions, (_c = {}, _c[tx] = __assign({}, (state.pendingTransactions[tx] || {}), { confirmations: confirmations }), _c)) });
        }
        default: return state;
    }
}
exports.accountReducer = accountReducer;
exports.getAccount = function (state) { return ((state || {}).account || '').toLowerCase() || undefined; };
exports.getBalance = function (state) { return state.balance; };
exports.getPendingTransactionsById = function (state) { return state.pendingTransactions; };
exports.getPendingTransactions = function (state) { return Object.values(state.pendingTransactions).filter(function (_) { return !!_.hash; }); };
//# sourceMappingURL=account.reducers.js.map