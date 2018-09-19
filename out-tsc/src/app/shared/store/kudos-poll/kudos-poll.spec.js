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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_1 = require("@ngrx/store");
var testing_2 = require("@ngrx/effects/testing");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var jasmine_marbles_1 = require("jasmine-marbles");
var __1 = require("../../");
var __2 = require("../");
var testing_utils_1 = require("../testing-utils");
var kudos_poll_reducers_1 = require("./kudos-poll.reducers");
var fromKudosPoll = require("./kudos-poll.reducers");
var kudosPollActions = require("./kudos-poll.actions");
var kudos_poll_effects_1 = require("./kudos-poll.effects");
var newAccount = function (n) { return "0x" + '0'.repeat(40 - String(n).length) + n; };
var newTx = function (n) { return "0x" + '0'.repeat(65 - String(n).length) + n; };
describe('KudosPoll - Reducers', function () {
    it('should be auto-initialized', function () {
        var finalState = testing_utils_1.reduceActions(kudos_poll_reducers_1.kudosPollReducer);
        expect(finalState).not.toBeUndefined();
    });
    it('should set loading state', function () {
        var _a, _b, _c, _d, _e, _f;
        var steps = testing_utils_1.reduceActions(kudos_poll_reducers_1.kudosPollReducer, [
            new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', {}),
            new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'dynamic', {}),
            new kudosPollActions.LoadBasicDataAction(newAccount(2)),
            new kudosPollActions.SetPollDataAction(newAccount(2), 'basic', {}),
        ], true);
        var kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);
        expect(kudosPolls).toEqual([
            {},
            (_a = {}, _a[newAccount(1)] = { loading: true, loaded: {} }, _a),
            (_b = {}, _b[newAccount(1)] = { loading: false, loaded: { basic: true } }, _b),
            (_c = {}, _c[newAccount(1)] = { loading: true, loaded: { basic: true } }, _c),
            (_d = {}, _d[newAccount(1)] = { loading: false, loaded: { basic: true, dynamic: true } }, _d),
            (_e = {}, _e[newAccount(1)] = { loading: false, loaded: { basic: true, dynamic: true } }, _e[newAccount(2)] = { loading: true, loaded: {} }, _e),
            (_f = {}, _f[newAccount(1)] = { loading: false, loaded: { basic: true, dynamic: true } }, _f[newAccount(2)] = { loading: false, loaded: { basic: true } }, _f),
        ]);
    });
    it('should set the data of a KudosPoll', function () {
        var _a, _b, _c, _d;
        var steps = testing_utils_1.reduceActions(kudos_poll_reducers_1.kudosPollReducer, [
            new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', { name: 'test' }),
            new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'dynamic', { active: true }),
        ], true);
        var kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);
        expect(kudosPolls).toEqual([
            {},
            (_a = {}, _a[newAccount(1)] = { loading: true, loaded: {} }, _a),
            (_b = {}, _b[newAccount(1)] = { loading: false, loaded: { basic: true }, name: 'test' }, _b),
            (_c = {}, _c[newAccount(1)] = { loading: true, loaded: { basic: true }, name: 'test' }, _c),
            (_d = {}, _d[newAccount(1)] = { loading: false, loaded: { basic: true, dynamic: true }, name: 'test', active: true }, _d),
        ]);
    });
    it('should set the balance of a member', function () {
        var _a, _b, _c, _d;
        var steps = testing_utils_1.reduceActions(kudos_poll_reducers_1.kudosPollReducer, [
            new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', { name: 'test' }),
            new kudosPollActions.SetBalanceAction(newAccount(1), newAccount(11), 9 * Math.pow(10, 17)),
        ], true);
        var kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);
        expect(kudosPolls).toEqual([
            {},
            (_a = {}, _a[newAccount(1)] = { loading: true, loaded: {} }, _a),
            (_b = {}, _b[newAccount(1)] = { loading: false, loaded: { basic: true }, name: 'test' }, _b),
            (_c = {}, _c[newAccount(1)] = { loading: false, loaded: { basic: true }, name: 'test', balances: (_d = {}, _d[newAccount(11)] = 9 * Math.pow(10, 17), _d) }, _c),
        ]);
    });
    it('should set the gratitudes of a member', function () {
        var _a, _b, _c, _d;
        var steps = testing_utils_1.reduceActions(kudos_poll_reducers_1.kudosPollReducer, [
            new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', { name: 'test' }),
            new kudosPollActions.SetGratitudesAction(newAccount(1), newAccount(11), [{ from: newAccount(90), kudos: 5, message: 'test' }]),
        ], true);
        var kudosPolls = steps.map(fromKudosPoll.getKudosPollsById);
        expect(kudosPolls).toEqual([
            {},
            (_a = {}, _a[newAccount(1)] = { loading: true, loaded: {} }, _a),
            (_b = {}, _b[newAccount(1)] = { loading: false, loaded: { basic: true }, name: 'test' }, _b),
            (_c = {}, _c[newAccount(1)] = { loading: false, loaded: { basic: true }, name: 'test', gratitudes: (_d = {},
                    _d[newAccount(11)] = [{ from: newAccount(90), kudos: 5, message: 'test' }],
                    _d)
            }, _c),
        ]);
    });
});
describe('KudosPoll - Effects', function () {
    var store;
    var effects;
    var actions;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot(__assign({}, __2.reducers)),
            ],
            providers: __1.PROVIDERS.concat([
                kudos_poll_effects_1.KudosPollEffects,
                testing_2.provideMockActions(function () { return actions; }),
            ]),
        });
        effects = testing_1.TestBed.get(kudos_poll_effects_1.KudosPollEffects);
        store = testing_1.TestBed.get(store_1.Store);
    });
    it('should get basic KudosPoll data', function () { return __awaiter(_this, void 0, void 0, function () {
        var setDataSpy, expected, dataGetter, serviceSpy;
        var _this = this;
        return __generator(this, function (_a) {
            setDataSpy = spyOn(effects, 'setData').and.returnValue(Observable_1.Observable.of({ type: 'mock' }));
            actions = jasmine_marbles_1.hot('-a', {
                a: new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            });
            expected = jasmine_marbles_1.cold('-r', {
                r: { type: 'mock' },
            });
            expect(effects.getBasicKudosPollData$).toBeObservable(expected);
            expect(setDataSpy).toHaveBeenCalledWith(newAccount(1), 'basic', false, jasmine.any(Function));
            console.log(setDataSpy.calls.mostRecent().args);
            dataGetter = setDataSpy.calls.mostRecent().args[3];
            serviceSpy = jasmine.createSpyObj('service', [
                'version', 'name', 'symbol', 'decimals', 'totalSupply', 'kudosByMember', 'maxKudosToMember', 'minDeadline', 'creation',
            ]);
            expect(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ];
            }); }); }).not.toThrow();
            return [2 /*return*/];
        });
    }); });
    it('should get dynamic KudosPoll data', function () {
        var setDataSpy = spyOn(effects, 'setData').and.returnValue(Observable_1.Observable.of({ type: 'mock' }));
        actions = jasmine_marbles_1.hot('-a', {
            a: new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
        });
        var expected = jasmine_marbles_1.cold('-r', {
            r: { type: 'mock' },
        });
        expect(effects.getDynamicKudosPollData$).toBeObservable(expected);
        expect(setDataSpy).toHaveBeenCalledWith(newAccount(1), 'dynamic', false, jasmine.any(Function));
    });
    it('should get data', function (done) {
        spyOn(effects, 'resolvePromise').and.returnValue(Observable_1.Observable.of({ name: 'test' }));
        var getKudosPollServiceAtSpy = spyOn(effects.kudosPollFactoryService, 'getKudosPollServiceAt')
            .and.returnValue({ onInitialized: Observable_1.Observable.of(true) });
        effects.setData(newAccount(1), 'basic', false, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({})];
        }); }); })
            .subscribe(function (action) {
            expect(action).toEqual(new kudosPollActions.SetPollDataAction(newAccount(1), 'basic', { name: 'test' }));
            expect(getKudosPollServiceAtSpy).toHaveBeenCalledWith(newAccount(1));
            done();
        });
    });
    it('should update the data of a KudosPoll when has changes', function () {
        var account1WatchStep = 0;
        var account1Changes = jasmine_marbles_1.hot('---c--------c', { c: newAccount(1) })
            .do(function () { return store.dispatch(new kudosPollActions.SetPollDataAction(newAccount(1), account1WatchStep++ ? 'dynamic' : 'basic', {})); });
        var account2Changes = jasmine_marbles_1.hot('-------c', { c: newAccount(2) })
            .do(function () { return store.dispatch(new kudosPollActions.SetPollDataAction(newAccount(2), 'basic', {})); });
        spyOn(effects.web3Service, 'watchContractChanges')
            .and.callFake(function (address) {
            var _a;
            return ((_a = {},
                _a[newAccount(1)] = account1Changes,
                _a[newAccount(2)] = account2Changes,
                _a)[address]);
        });
        actions = jasmine_marbles_1.hot('-a----x---b', {
            a: new kudosPollActions.LoadBasicDataAction(newAccount(1)),
            b: new kudosPollActions.LoadDynamicDataAction(newAccount(1)),
            x: new kudosPollActions.LoadBasicDataAction(newAccount(2)),
        });
        var expected = jasmine_marbles_1.cold('------------b', {
            a: new kudosPollActions.LoadBasicDataAction(newAccount(1), true),
            b: new kudosPollActions.LoadDynamicDataAction(newAccount(1), true),
            x: new kudosPollActions.LoadBasicDataAction(newAccount(2), true),
        });
        expect(effects.watchKudosPollChanges$).toBeObservable(expected);
    });
});
//# sourceMappingURL=kudos-poll.spec.js.map