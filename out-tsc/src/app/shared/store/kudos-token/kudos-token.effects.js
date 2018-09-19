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
require("rxjs/add/observable/from");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/distinct");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var __1 = require("../../");
var fromRoot = require("../reducers");
var kudosTokenActions = require("./kudos-token.actions");
var KudosTokenEffects = /** @class */ (function () {
    function KudosTokenEffects(actions$, store, web3Service, kudosTokenFactoryService) {
        var _this = this;
        this.actions$ = actions$;
        this.store = store;
        this.web3Service = web3Service;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.loadBalanceOfCurrentAccount$ = this.actions$
            .ofType(effects_1.ROOT_EFFECTS_INIT)
            .mergeMap(function () { return _this.store.select(fromRoot.getAccount); })
            .filter(function (_) { return !!_; })
            .distinctUntilChanged()
            .mergeMap(function (account) {
            return _this.store.select(fromRoot.getKudosTokensById)
                .map(function (_) { return Object.keys(_); })
                .distinctUntilChanged(function (a, b) { return a.toString() === b.toString(); })
                .mergeMap(function (addresses) {
                if (addresses === void 0) { addresses = []; }
                return Observable_1.Observable.from(addresses.map(function (address) { return new kudosTokenActions.LoadAccountBalanceAction(address, account); }));
            });
        });
        this.getBasicKudosTokenData$ = this.actions$
            .ofType(kudosTokenActions.LOAD_BASIC_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, force = _a.force;
            return _this.setData(address, 'basic', force, function (kudosTokenService) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = {
                                address: address
                            };
                            return [4 /*yield*/, kudosTokenService.version()];
                        case 1:
                            _a.version = _c.sent();
                            return [4 /*yield*/, kudosTokenService.organisationName()];
                        case 2:
                            _b = (_c.sent());
                            if (_b) return [3 /*break*/, 4];
                            return [4 /*yield*/, kudosTokenService.name()];
                        case 3:
                            _b = (_c.sent());
                            _c.label = 4;
                        case 4:
                            _a.organisationName = _b;
                            return [4 /*yield*/, kudosTokenService.name()];
                        case 5:
                            _a.name = _c.sent();
                            return [4 /*yield*/, kudosTokenService.symbol()];
                        case 6:
                            _a.symbol = _c.sent();
                            return [4 /*yield*/, kudosTokenService.decimals()];
                        case 7:
                            _a.decimals = _c.sent();
                            return [4 /*yield*/, kudosTokenService.totalSupply()];
                        case 8:
                            _a.totalSupply = _c.sent();
                            return [4 /*yield*/, kudosTokenService.getMembers()];
                        case 9:
                            _a.members = _c.sent();
                            return [4 /*yield*/, kudosTokenService.getBalances()];
                        case 10: return [2 /*return*/, (_a.balances = ((_c.sent()) || []).reduce(function (acc, _) {
                                var _a;
                                return (__assign({}, acc, (_a = {}, _a[_.member] = _.balance, _a)));
                            }, {}),
                                _a)];
                    }
                });
            }); });
        });
        this.getTotalKudosTokenData$ = this.actions$
            .ofType(kudosTokenActions.LOAD_TOTAL_DATA)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, force = _a.force;
            return _this.setData(address, 'total', force, function (kudosTokenService) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, kudosTokenService.owner()];
                        case 1:
                            _a.owner = _b.sent();
                            return [4 /*yield*/, kudosTokenService.getContacts()];
                        case 2:
                            _a.contacts = ((_b.sent()) || []).reduce(function (acc, _) {
                                var _a;
                                return (__assign({}, acc, (_a = {}, _a[_.member] = _.name, _a)));
                            }, {});
                            return [4 /*yield*/, kudosTokenService.getPolls()];
                        case 3:
                            _a.polls = _b.sent();
                            return [4 /*yield*/, kudosTokenService.isActivePoll()];
                        case 4: return [2 /*return*/, (_a.isActivePoll = _b.sent(),
                                _a)];
                    }
                });
            }); });
        });
        this.getBalanceOfAccount$ = this.actions$
            .ofType(kudosTokenActions.LOAD_ACCOUNT_BALANCE)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .mergeMap(function (_a) {
            var address = _a.address, account = _a.account;
            return _this.store.select(fromRoot.getKudosTokenByAddress(address))
                .first()
                .map(function (kudosToken) { return ((kudosToken && kudosToken.balances) || {})[account]; })
                .filter(function (_) { return !!_; })
                .mergeMap(function () { return _this.getKudosTokenServiceData(address, (function (kudosTokenService) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, kudosTokenService.balanceOf(account)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })); })
                .map(function (balance) { return new kudosTokenActions.SetBalanceAction(address, account, balance); });
        });
        this.watchKudosTokenChanges$ = this.actions$
            .ofType(kudosTokenActions.LOAD_TOTAL_DATA, kudosTokenActions.LOAD_BASIC_DATA)
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
            return _this.store.select(function (_) { return fromRoot.getKudosTokenLoaded(address)(_); })
                .first()
                .filter(function (_) { return !!_; })
                .mergeMap(function (_a) {
                var basic = _a.basic, total = _a.total;
                var actions = [];
                if (basic) {
                    actions.push(new kudosTokenActions.LoadBasicDataAction(address, true));
                }
                if (total) {
                    actions.push(new kudosTokenActions.LoadTotalDataAction(address, true));
                }
                return Observable_1.Observable.from(actions);
            });
        });
    }
    KudosTokenEffects.prototype.setData = function (address, type, force, dataGetter) {
        var _this = this;
        return this.store.select(fromRoot.getKudosTokensById)
            .first()
            .filter(function (kudosTokens) { return !(kudosTokens && kudosTokens[address] && kudosTokens[address].loaded[type]) || force; })
            .mergeMap(function () { return _this.getKudosTokenServiceData(address, dataGetter); })
            .map(function (data) { return new kudosTokenActions.SetTokenDataAction(address, type, data); });
    };
    KudosTokenEffects.prototype.getKudosTokenServiceData = function (address, dataGetter) {
        var _this = this;
        var kudosTokenService = this.kudosTokenFactoryService.getKudosTokenServiceAt(address);
        return kudosTokenService.onIsValid
            .filter(function (_) { return !!_; })
            .first()
            .mergeMap(function () { return _this.resolvePromise(dataGetter(kudosTokenService)); });
    };
    KudosTokenEffects.prototype.resolvePromise = function (promise) {
        return Observable_1.Observable.fromPromise(promise);
    };
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosTokenEffects.prototype, "loadBalanceOfCurrentAccount$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosTokenEffects.prototype, "getBasicKudosTokenData$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosTokenEffects.prototype, "getTotalKudosTokenData$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosTokenEffects.prototype, "getBalanceOfAccount$", void 0);
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], KudosTokenEffects.prototype, "watchKudosTokenChanges$", void 0);
    KudosTokenEffects = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [effects_1.Actions,
            store_1.Store,
            __1.Web3Service,
            __1.KudosTokenFactoryService])
    ], KudosTokenEffects);
    return KudosTokenEffects;
}());
exports.KudosTokenEffects = KudosTokenEffects;
//# sourceMappingURL=kudos-token.effects.js.map