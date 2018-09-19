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
require("rxjs/add/operator/share");
require("rxjs/add/operator/shareReplay");
var shared_1 = require("../../../shared");
var PollActiveComponent = /** @class */ (function () {
    function PollActiveComponent(web3Service, router, kudosTokenFactoryService, activatedRoute) {
        var _this = this;
        this.web3Service = web3Service;
        this.router = router;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.activatedRoute = activatedRoute;
        this.tokenDecimals = 0;
        this.tokenStep = 0;
        this.reward = {};
        this.suggested = 'custom';
        this.kudosTokenService$ = this.activatedRoute.parent.params
            .filter(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return !!tokenAddress;
        })
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .shareReplay()
            .filter(function (_) { return !!_; });
        this.token$ = this.kudosTokenService$.mergeMap(function (s) { return s.getTokenInfo(); });
        this.imMember$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.imMember(); }); });
        this.getActivePollContract$ = this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.getActivePollContract(); }); })
            .filter(function (_) { return !!_; })
            .shareReplay();
        this.getActivePollMembersNumber$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.membersNumber(); }); })
            .share();
        this.getActivePollRemainingKudos$ = this.getActivePollContract$
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
        this.getActivePollCreation$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.creation(); }); })
            .share();
        this.maxKudosToSend$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = {};
                        _c = (_b = _).fromInt;
                        return [4 /*yield*/, _.remainingKudos()];
                    case 1: return [4 /*yield*/, _c.apply(_b, [_f.sent()])];
                    case 2:
                        _a.remaining = _f.sent();
                        _e = (_d = _).fromInt;
                        return [4 /*yield*/, _.maxKudosToMember()];
                    case 3: return [4 /*yield*/, _e.apply(_d, [_f.sent()])];
                    case 4: return [2 /*return*/, (_a.maxKudos = _f.sent(),
                            _a)];
                }
            });
        }); }); })
            .map(function (_a) {
            var remaining = _a.remaining, maxKudos = _a.maxKudos;
            return Math.min(remaining, maxKudos);
        })
            .share();
        this.getOtherMembers$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.getMembers(); }); })
            .mergeMap(function (members) { return _this.kudosTokenService$.map(function (s) { return s.getContactsOf(members); }); })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(_); })
            .combineLatest(this.web3Service.account$)
            .map(function (_a) {
            var contacts = _a[0], account = _a[1];
            return contacts.filter(function (_) { return (_.member || '').toLowerCase() !== (account || '').toLowerCase(); });
        })
            .share();
        this.myGratitudesSent$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.myGratitudesSent(); }); })
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
                            return [4 /*yield*/, kudosTokenService.getContact(_.to)];
                        case 2: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.toName = _c.sent(), _b)])))];
                    }
                });
            }); });
        })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
            .shareReplay();
        this.canBeClosed$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.canBeClosed(); }); })
            .share();
        this.activePollRemaining$ = this.getActivePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.minDeadline(); }); })
            .map(function (_) { return _ * 1000; })
            .catch(function () { return Observable_1.Observable.empty(); })
            .share();
    }
    PollActiveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.kudosTokenService$.mergeMap(function (s) { return s.checkUpdates(function (_) { return _.getActivePollContract(); }); })
            .filter(function (_) { return !_; })
            .first()
            .catch(function () { return Observable_1.Observable.empty(); })
            .subscribe(function () { return _this.router.navigate(['/']); });
        this.token$
            .first()
            .catch(function () { return Observable_1.Observable.empty(); })
            .subscribe(function (_a) {
            var decimals = _a.decimals;
            _this.tokenDecimals = decimals;
            _this.tokenStep = Math.pow(10, -decimals);
        });
        this.maxKudosToSend$
            .subscribe(function (maxKudos) { return _this.maxKudos = maxKudos; });
    };
    PollActiveComponent.prototype.setRewardKudos = function (inputNumber, value) {
        var cleanNumber = +(+value || +inputNumber.value || 0).toFixed(this.tokenDecimals);
        var number = cleanNumber;
        if (number <= 0) {
            number = undefined;
        }
        if (number > this.maxKudos) {
            number = this.maxKudos;
        }
        if (this.reward.kudos !== number || number !== +inputNumber.value) {
            this.reward.kudos = number;
            inputNumber.value = number;
        }
        this.setRewardKudosType(+number);
    };
    PollActiveComponent.prototype.setRewardKudosType = function (value) {
        var cleanNumber = +(+value || 0).toFixed(this.tokenDecimals);
        var percentage = cleanNumber / this.maxKudos;
        this.suggested = [1, .5, .25, .1].indexOf(percentage) !== -1 ? percentage : 'custom';
    };
    PollActiveComponent.prototype.setSuggestedReward = function (reward) {
        if (reward === 'custom') {
            this.rewardInput.nativeElement.focus();
            return;
        }
        this.setRewardKudos(this.rewardInput.nativeElement, reward * this.maxKudos);
    };
    PollActiveComponent.prototype.sendReward = function (form) {
        var _this = this;
        var done = function (success) { return _this.onActionFinished(success, _this.reward, function (_) { return _this.reward = _; }, form); };
        this.reward.working = true;
        this.getActivePollContract$
            .first()
            .subscribe(function (kudosPollService) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = kudosPollService).reward;
                        _c = [this.reward.member];
                        return [4 /*yield*/, kudosPollService.fromDecimals(this.reward.kudos)];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent(),
                            this.reward.message]))
                            .$observable
                            .subscribe(function (status) {
                            if (status === 'waiting') {
                                setTimeout(function () { return done(true); }, 2000);
                            }
                            if (status === 'error') {
                                done();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PollActiveComponent.prototype.trackGratitude = function (index) {
        return "" + index || undefined;
    };
    PollActiveComponent.prototype.onActionFinished = function (success, obj, setter, form) {
        if (success) {
            if (form) {
                setter({});
                form.reset();
            }
        }
        else {
            setter(__assign({}, obj, { working: undefined }));
        }
    };
    __decorate([
        core_1.ViewChild('rewardInput'),
        __metadata("design:type", core_1.ElementRef)
    ], PollActiveComponent.prototype, "rewardInput", void 0);
    PollActiveComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-poll-active',
            templateUrl: './poll-active.component.html',
            styleUrls: ['./poll-active.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [shared_1.Web3Service,
            router_1.Router,
            shared_1.KudosTokenFactoryService,
            router_1.ActivatedRoute])
    ], PollActiveComponent);
    return PollActiveComponent;
}());
exports.PollActiveComponent = PollActiveComponent;
//# sourceMappingURL=poll-active.component.js.map