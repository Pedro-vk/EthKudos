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
var testing_1 = require("@angular/core/testing");
var store_1 = require("@ngrx/store");
var router_store_1 = require("@ngrx/router-store");
var testing_2 = require("@ngrx/effects/testing");
var jasmine_marbles_1 = require("jasmine-marbles");
var __1 = require("../../");
var __2 = require("../");
var kudosTokenActions = require("../kudos-token/kudos-token.actions");
var router_effects_1 = require("./router.effects");
var newAccount = function (n) { return "0x" + '0'.repeat(40 - String(n).length) + n; };
describe('Router - Effects', function () {
    var store;
    var effects;
    var actions;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot(__assign({}, __2.reducers)),
            ],
            providers: __1.PROVIDERS.concat([
                router_effects_1.RouterEffects,
                testing_2.provideMockActions(function () { return actions; }),
            ]),
        });
        effects = testing_1.TestBed.get(router_effects_1.RouterEffects);
        store = testing_1.TestBed.get(store_1.Store);
    });
    it('should request the loading of the current kudos token', function () {
        actions = jasmine_marbles_1.hot('-n', {
            n: { type: router_store_1.ROUTER_NAVIGATION, payload: { routerState: { root: { firstChild: { params: { tokenAddress: newAccount(1) } } } } } },
        });
        var expected = jasmine_marbles_1.cold('-(ab)', {
            a: new kudosTokenActions.LoadBasicDataAction(newAccount(1)),
            b: new kudosTokenActions.LoadTotalDataAction(newAccount(1)),
        });
        expect(effects.loadKudosTokenOnOpen$).toBeObservable(expected);
    });
});
//# sourceMappingURL=router.spec.js.map