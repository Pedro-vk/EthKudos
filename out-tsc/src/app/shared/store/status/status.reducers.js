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
var statusActions = require("./status.actions");
var initialState = {
    status: undefined,
};
function statusReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case statusActions.SET_STATUS: {
            return __assign({}, state, { status: action.payload });
        }
        default: return state;
    }
}
exports.statusReducer = statusReducer;
exports.getStatus = function (state) { return state.status; };
//# sourceMappingURL=status.reducers.js.map