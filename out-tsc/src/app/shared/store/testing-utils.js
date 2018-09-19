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
function reduceActions(reducer, actions, returnSteps) {
    if (actions === void 0) { actions = []; }
    if (returnSteps === void 0) { returnSteps = false; }
    var steps = [];
    var finalState = [
        { type: store_1.INIT }
    ].concat(actions).reduce(function (state, action) {
        var nextState = reducer(state, action);
        steps.push(__assign({}, nextState, { $action: action }));
        return nextState;
    }, undefined);
    return returnSteps ? steps : finalState;
}
exports.reduceActions = reduceActions;
//# sourceMappingURL=testing-utils.js.map