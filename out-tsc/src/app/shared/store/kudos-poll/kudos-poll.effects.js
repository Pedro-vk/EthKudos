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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/of");
require("rxjs/add/operator/distinct");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var __1 = require("../../");
var fromRoot = require("../reducers");
var kudosPollActions = require("./kudos-poll.actions");
var KudosPollEffects = /** @class */ (function () {
    function KudosPollEffects(actions$, store, web3Service, kudosPollFactoryService) {
        var _this = this;
        this.actions$ = actions$;
        this.store = store;
        this.web3Service = web3Service;
        this.kudosPollFactoryService = kudosPollFactoryService;
        this.getBasicKudosPollData$ = this.actions$
            .ofType(kudosPollActions.LOAD_BASIC_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, force = _a.force;
            return _this.setData(address, 'basic', force, function (kudosPollService) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {
                                address: address
                            };
                            return [4 /*yield*/, kudosPollService.totalSupply()];
                        case 1:
                            // version: await kudosPollService.version(),
                            // name: await kudosPollService.name(),
                            // symbol: await kudosPollService.symbol(),
                            // decimals: await kudosPollService.decimals(),
                            _a.totalSupply = _b.sent();
                            return [4 /*yield*/, kudosPollService.kudosByMember()];
                        case 2:
                            _a.kudosByMember = _b.sent();
                            return [4 /*yield*/, kudosPollService.maxKudosToMember()];
                        case 3:
                            _a.maxKudosToMember = _b.sent();
                            return [4 /*yield*/, kudosPollService.minDeadline()];
                        case 4:
                            _a.minDeadline = _b.sent();
                            return [4 /*yield*/, kudosPollService.creation()];
                        case 5: return [2 /*return*/, (_a.creation = _b.sent(),
                                _a)];
                    }
                });
            }); });
        });
        this.getDynamicKudosPollData$ = this.actions$
            .ofType(kudosPollActions.LOAD_DYNAMIC_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, force = _a.force;
            return _this.setData(address, 'dynamic', force, function (kudosPollService) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, kudosPollService.active()];
                        case 1:
                            _a.active = _b.sent();
                            return [4 /*yield*/, kudosPollService.getMembers()];
                        case 2:
                            _a.members = _b.sent();
                            return [4 /*yield*/, kudosPollService.getBalances()];
                        case 3:
                            _a.balances = ((_b.sent()) || []).reduce(function (acc, _) {
                                var _a;
                                return (__assign({}, acc, (_a = {}, _a[_.member] = _.balance, _a)));
                            }, {});
                            return [4 /*yield*/, kudosPollService.allGratitudes()];
                        case 4: return [2 /*return*/, (_a.gratitudes = ((_b.sent()) || []).reduce(function (acc, gratitude) {
                                var _a;
                                return (__assign({}, acc, (_a = {}, _a[gratitude.to] = gratitude, _a)));
                            }, {}),
                                _a)];
                    }
                });
            }); });
        });
        this.getGratitudesOf$ = this.actions$
            .ofType(kudosPollActions.LOAD_ACCOUNT_GRATITUDES)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, account = _a.account;
            return _this.getKudosPollServiceData(address, function (kudosPollService) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, kudosPollService.getGratitudesOf(account)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })
                .map(function (gratitudes) { return ({ gratitudes: gratitudes, address: address, account: account }); });
        })
            .map(function (_a) {
            var address = _a.address, account = _a.account, gratitudes = _a.gratitudes;
            return new kudosPollActions.SetGratitudesAction(address, account, gratitudes);
        });
        this.watchKudosPollChanges$ = this.actions$
            .ofType(kudosPollActions.LOAD_DYNAMIC_DATA, kudosPollActions.LOAD_BASIC_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .map(function (_a) {
            var address = _a.address;
            return address;
        })
            .distinct()
            .mergeMap(function (address) { return _this.web3Service.watchContractChanges(address); })
            .mergeMap(function (address) {
            return _this.store.select(function (_) { return fromRoot.getKudosPollLoaded(address)(_); })
                .first()
                .filter(function (_) { return !!_; })
                .mergeMap(function (_a) {
                var dynamic = _a.dynamic;
                if (dynamic) {
                    return Observable_1.Observable.of(new kudosPollActions.LoadDynamicDataAction(address, true));
                }
                return Observable_1.Observable.empty();
            });
        });
        this.watchGratitudesSent$ = this.actions$
            .ofType(kudosPollActions.LOAD_DYNAMIC_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .map(function (_a) {
            var address = _a.address;
            return address;
        })
            .distinct()
            .mergeMap(function (address) {
            return _this.kudosPollFactoryService.getKudosPollServiceAt(address).Reward$.map(function (data) { return (__assign({}, data, { address: address })); });
        })
            .map(function (_a) {
            var address = _a.address, rewarded = _a.rewarded;
            return new kudosPollActions.LoadAccountGratitudesAction(address, rewarded);
        });
    }
    KudosPollEffects.prototype.setData = function (address, type, force, dataGetter) {
        var _this = this;
        return this.store.select(fromRoot.getKudosPollsById)
            .first()
            .filter(function (kudosPolls) { return !(kudosPolls && kudosPolls[address] && kudosPolls[address].loaded[type]) || force; })
            .mergeMap(function () { return _this.getKudosPollServiceData(address, dataGetter); })
            .map(function (data) { return new kudosPollActions.SetPollDataAction(address, type, data); });
    };
    KudosPollEffects.prototype.getKudosPollServiceData = function (address, dataGetter) {
        var _this = this;
        var kudosPollService = this.kudosPollFactoryService.getKudosPollServiceAt(address);
        return kudosPollService.onInitialized
            .first()
            .mergeMap(function () { return _this.resolvePromise(dataGetter(kudosPollService)); });
    };
    KudosPollEffects.prototype.resolvePromise = function (promise) {
        return Observable_1.Observable.fromPromise(promise);
    };
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosPollEffects.prototype, "getBasicKudosPollData$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosPollEffects.prototype, "getDynamicKudosPollData$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosPollEffects.prototype, "getGratitudesOf$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosPollEffects.prototype, "watchKudosPollChanges$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosPollEffects.prototype, "watchGratitudesSent$", void 0);
    KudosPollEffects = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [effects_1.Actions,
            store_1.Store,
            __1.Web3Service,
            __1.KudosPollFactoryService])
    ], KudosPollEffects);
    return KudosPollEffects;
}());
exports.KudosPollEffects = KudosPollEffects;
//# sourceMappingURL=kudos-poll.effects.js.map