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
var effects_1 = require("@ngrx/effects");
var testing_2 = require("@ngrx/effects/testing");
var jasmine_marbles_1 = require("jasmine-marbles");
var __1 = require("../../");
var __2 = require("../");
var testing_utils_1 = require("../testing-utils");
var web3_service_1 = require("../../web3.service");
var status_reducers_1 = require("./status.reducers");
var fromStatus = require("./status.reducers");
var statusActions = require("./status.actions");
var status_effects_1 = require("./status.effects");
describe('Status - Reducers', function () {
    it('should be auto-initialized', function () {
        var finalState = testing_utils_1.reduceActions(status_reducers_1.statusReducer);
        expect(finalState).not.toBeUndefined();
    });
    it('should be able to update the status', function () {
        var steps = testing_utils_1.reduceActions(status_reducers_1.statusReducer, [
            new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoNetwork),
            new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoProvider),
            new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoAccount),
            new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.Total),
        ], true);
        var status = steps.map(fromStatus.getStatus);
        expect(status).toEqual([
            undefined,
            web3_service_1.ConnectionStatus.NoNetwork,
            web3_service_1.ConnectionStatus.NoProvider,
            web3_service_1.ConnectionStatus.NoAccount,
            web3_service_1.ConnectionStatus.Total,
        ]);
    });
});
describe('Status - Effects', function () {
    var store;
    var effects;
    var actions;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot(__assign({}, __2.reducers)),
            ],
            providers: __1.PROVIDERS.concat([
                status_effects_1.StatusEffects,
                testing_2.provideMockActions(function () { return actions; }),
            ]),
        });
        effects = testing_1.TestBed.get(status_effects_1.StatusEffects);
        store = testing_1.TestBed.get(store_1.Store);
    });
    it('should watch for status changes', function () {
        var fakeStatus = jasmine_marbles_1.cold('p--a-n---t|', {
            n: web3_service_1.ConnectionStatus.NoNetwork,
            p: web3_service_1.ConnectionStatus.NoProvider,
            a: web3_service_1.ConnectionStatus.NoAccount,
            t: web3_service_1.ConnectionStatus.Total,
        });
        spyOn(effects, 'getWeb3Status').and.returnValue(fakeStatus);
        actions = jasmine_marbles_1.hot('-a', {
            a: { type: effects_1.ROOT_EFFECTS_INIT },
        });
        var expected = jasmine_marbles_1.cold('-p--a-n---t|', {
            n: new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoNetwork),
            p: new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoProvider),
            a: new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.NoAccount),
            t: new statusActions.SetStatusAction(web3_service_1.ConnectionStatus.Total),
        });
        expect(effects.watchStatusChanges$).toBeObservable(expected);
    });
});
//# sourceMappingURL=status.spec.js.map