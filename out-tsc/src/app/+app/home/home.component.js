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
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/combineLatest");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/share");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var shared_1 = require("../../shared");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(kudosTokenFactoryService, activatedRoute) {
        var _this = this;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.activatedRoute = activatedRoute;
        this.kudosTokenService$ = this.activatedRoute.parent.params
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .shareReplay();
        this.token$ = this.kudosTokenService$.mergeMap(function (s) { return s.getTokenInfo(); });
        this.imOwner$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.imOwner(); }); });
        this.imMember$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.imMember(); }); });
        this.getBalances$ = this.kudosTokenService$
            .mergeMap(function (kudosTokenService) {
            return kudosTokenService
                .checkUpdates(function (_) { return _.getBalances(); })
                .map(function (balances) { return balances.sort(function (a, b) { return b.balance - a.balance; }); })
                .map(function (balances) { return balances.map(function (_) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [{}, _];
                        _b = {};
                        return [4 /*yield*/, kudosTokenService.fromInt(_.balance)];
                    case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.balance = _c.sent(), _b)])))];
                }
            }); }); }); })
                .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
                .combineLatest(Observable_1.Observable.fromPromise(kudosTokenService.getPreviousPollsContracts())
                .filter(function (polls) { return polls.length !== 0; })
                .map(function (polls) {
                return polls.map(function (poll) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, poll.gratitudesNumberByMember()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); });
            })
                .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
                .map(function (gratitudesByPoll) {
                var mix = function (a, b) {
                    return Object.keys(__assign({}, a, b))
                        .filter(function (_, i, list) { return list.indexOf(_) === i; })
                        .reduce(function (acc, _) {
                        var _a;
                        return (__assign({}, acc, (_a = {}, _a[_] = (a[_] || 0) + (b[_] || 0), _a)));
                    }, {});
                };
                var clean = function (obj) { return Object.keys(obj).reduce(function (acc, _) {
                    var _a;
                    return (__assign({}, acc, (_a = {}, _a[_] = 1, _a)));
                }, {}); };
                return gratitudesByPoll
                    .reduce(function (acc, _) { return ({
                    received: mix(acc.received, _.received),
                    sent: mix(acc.sent, _.sent),
                    poll: mix(acc.poll, clean(_.received)),
                }); }, { received: {}, sent: {}, poll: {} });
            })
                .startWith(undefined))
                .map(function (_a) {
                var ranking = _a[0], gratitudesNumber = _a[1];
                return ranking
                    .map(function (_) { return (__assign({}, _, { gratitudesReceived: gratitudesNumber ? gratitudesNumber.received[_.member] || 0 : undefined, gratitudesSent: gratitudesNumber ? gratitudesNumber.sent[_.member] || 0 : undefined, entries: gratitudesNumber ? gratitudesNumber.poll[_.member] || 0 : undefined })); });
            });
        })
            .map(function (balances) {
            var maxGratitudesSent = Math.max.apply(Math, balances.map(function (_) { return _.gratitudesSent; }));
            var topSenders = 0.8;
            return balances
                .map(function (balance) { return (__assign({}, balance, { achievements: {
                    topSender: balance.entries && balance.gratitudesSent === maxGratitudesSent,
                    onTop: balance.entries && (balance.gratitudesSent > (maxGratitudesSent * topSenders)),
                    noParticipation: balance.entries && balance.gratitudesSent === 0,
                    beginner: balance.entries === 0,
                } })); });
        });
        this.getActivePollContract$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.getActivePollContract(); }); })
            .shareReplay();
        this.getActivePollMembersNumber$ = this.getActivePollContract$
            .filter(function (_) { return !!_; })
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.membersNumber(); }); })
            .share();
        this.getActivePollRemainingKudos$ = this.getActivePollContract$
            .filter(function (_) { return !!_; })
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = _).fromInt;
                        return [4 /*yield*/, _.remainingKudos()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        }); }); })
            .share();
        this.getPreviousPollsContracts$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.getPreviousPollsContracts(); }); })
            .map(function (list) {
            return list
                .map(function (kudosPollService, i) {
                return kudosPollService
                    .checkUpdates(function (_) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = {};
                                return [4 /*yield*/, _.creation()];
                            case 1:
                                _a.creation = (_d.sent()) * 1000;
                                _c = (_b = _).fromInt;
                                return [4 /*yield*/, _.myKudos()];
                            case 2: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                            case 3: return [2 /*return*/, (_a.kudos = _d.sent(),
                                    _a)];
                        }
                    });
                }); })
                    .map(function (_a) {
                    var creation = _a.creation, kudos = _a.kudos;
                    return ({
                        i: i,
                        address: kudosPollService.address,
                        creation: creation,
                        kudos: kudos,
                    });
                });
            });
        })
            .mergeMap(function (list) { return Observable_1.Observable.combineLatest(list); })
            .map(function (_) { return _.reverse(); });
    }
    HomeComponent.prototype.trackContracts = function (index, contract) {
        return contract.address;
    };
    HomeComponent.prototype.trackMember = function (index, _a) {
        var member = _a.member;
        return member || undefined;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [shared_1.KudosTokenFactoryService, router_1.ActivatedRoute])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map