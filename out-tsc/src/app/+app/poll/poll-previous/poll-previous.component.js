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
require("rxjs/add/observable/empty");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var shared_1 = require("../../../shared");
var PollPreviousComponent = /** @class */ (function () {
    function PollPreviousComponent(activatedRoute, kudosTokenFactoryService, kudosPollFactoryService) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.kudosPollFactoryService = kudosPollFactoryService;
        this.kudosTokenService$ = this.activatedRoute.parent.params
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .shareReplay();
        this.token$ = this.kudosTokenService$.mergeMap(function (s) { return s.getTokenInfo(); });
        this.pollContract$ = this.activatedRoute.params
            .filter(function (_a) {
            var address = _a.address;
            return !!address;
        })
            .map(function (_a) {
            var address = _a.address;
            return _this.kudosPollFactoryService.getKudosPollServiceAt(address);
        })
            .mergeMap(function (kudosPollService) { return kudosPollService.onInitialized.startWith(undefined).map(function () { return kudosPollService; }); })
            .shareReplay();
        this.pollContractMembersNumber$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.membersNumber(); }); })
            .shareReplay();
        this.pollContractCreation$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.creation(); }); })
            .shareReplay();
        this.pollContractMyGratitudes$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.myGratitudes(); }); })
            .combineLatest(this.kudosTokenService$)
            .map(function (_a) {
            var gratitudes = _a[0], kudosTokenService = _a[1];
            return gratitudes
                .map(function (_) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [{}, _];
                            _b = {};
                            return [4 /*yield*/, kudosTokenService.fromInt(_.kudos)];
                        case 1:
                            _b.kudos = _c.sent();
                            return [4 /*yield*/, kudosTokenService.getContact(_.from)];
                        case 2: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.fromName = _c.sent(), _b)])))];
                    }
                });
            }); });
        })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
            .shareReplay();
        this.pollContractGrastitudesNumberByMember$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.gratitudesNumberByMember(); }); });
        this.pollContractResults$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.getPollResults(); }); })
            .map(function (results) { return results.sort(function (a, b) { return b.kudos - a.kudos; }); })
            .combineLatest(this.kudosTokenService$, this.pollContractGrastitudesNumberByMember$
            .first()
            .catch(function () { return Observable_1.Observable.empty(); })
            .startWith(undefined))
            .map(function (_a) {
            var results = _a[0], kudosTokenService = _a[1], gratitudesNumber = _a[2];
            return results.map(function (_) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [{}, _];
                            _b = {};
                            return [4 /*yield*/, kudosTokenService.getContact(_.member)];
                        case 1:
                            _b.name = _c.sent();
                            return [4 /*yield*/, kudosTokenService.fromInt(_.kudos)];
                        case 2: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.kudos = _c.sent(), _b.gratitudesReceived = gratitudesNumber ? gratitudesNumber.received[_.member] || 0 : undefined, _b.gratitudesSent = gratitudesNumber ? gratitudesNumber.sent[_.member] || 0 : undefined, _b)])))];
                    }
                });
            }); });
        })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
            .map(function (balances) {
            var maxGratitudesSent = Math.max.apply(Math, balances.map(function (_) { return _.gratitudesSent; }));
            var topSenders = 0.8;
            return balances
                .map(function (balance) { return (__assign({}, balance, { achievements: {
                    topSender: balance.gratitudesSent === maxGratitudesSent,
                    onTop: (balance.gratitudesSent > (maxGratitudesSent * topSenders)),
                    noParticipation: balance.gratitudesSent === 0,
                } })); });
        })
            .shareReplay();
    }
    PollPreviousComponent.prototype.trackGratitude = function (index) {
        return "" + index || undefined;
    };
    PollPreviousComponent.prototype.trackMember = function (index, _a) {
        var member = _a.member;
        return member || undefined;
    };
    PollPreviousComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-poll-previous',
            templateUrl: './poll-previous.component.html',
            styleUrls: ['./poll-previous.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            shared_1.KudosTokenFactoryService,
            shared_1.KudosPollFactoryService])
    ], PollPreviousComponent);
    return PollPreviousComponent;
}());
exports.PollPreviousComponent = PollPreviousComponent;
//# sourceMappingURL=poll-previous.component.js.map