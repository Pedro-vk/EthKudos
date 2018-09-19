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
var store_1 = require("@ngrx/store");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/share");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var fromRoot = require("../../shared/store/reducers");
var shared_1 = require("../../shared");
var AdminComponent = /** @class */ (function () {
    function AdminComponent(store, web3Service, kudosTokenFactoryService, router, activatedRoute, changeDetectorRef) {
        var _this = this;
        this.store = store;
        this.web3Service = web3Service;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.changeDetectorRef = changeDetectorRef;
        this.newPoll = {};
        this.newMember = {};
        this.memberName = {};
        this.memberWorking = {};
        this.kudosTokenService$ = this.activatedRoute.parent.params
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .shareReplay();
        this.kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithAccountData);
        this.activePollContract$ = this.web3Service.changes$
            .startWith(undefined)
            .mergeMap(function () { return _this.kudosTokenService$.mergeMap(function (s) { return Observable_1.Observable.fromPromise(s.getActivePollContract()); }); })
            .filter(function (_) { return !!_; });
        this.activePollCanBeClosed$ = this.activePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.canBeClosed(); }); })
            .catch(function () { return Observable_1.Observable.of(false); })
            .distinctUntilChanged()
            .share();
        this.kudosSentOnActivePoll$ = this.activePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return __awaiter(_this, void 0, void 0, function () {
            var totalSupply, kudosByMember, members, initialTotal, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _.totalSupply()];
                    case 1:
                        totalSupply = _b.sent();
                        return [4 /*yield*/, _.kudosByMember()];
                    case 2:
                        kudosByMember = _b.sent();
                        return [4 /*yield*/, _.getMembers()];
                    case 3:
                        members = (_b.sent()).length;
                        initialTotal = kudosByMember * members;
                        _a = {};
                        return [4 /*yield*/, _.fromInt(initialTotal - totalSupply)];
                    case 4:
                        _a.sent = _b.sent();
                        return [4 /*yield*/, _.fromInt(initialTotal)];
                    case 5: return [2 /*return*/, (_a.total = _b.sent(),
                            _a)];
                }
            });
        }); }); })
            .catch(function () { return Observable_1.Observable.of({ sent: 0, total: 0 }); })
            .distinctUntilChanged()
            .share();
        this.percentageKudosSentOnActivePoll$ = this.kudosSentOnActivePoll$
            .map(function (_a) {
            var sent = _a.sent, total = _a.total;
            return sent / total;
        })
            .share();
        this.activePollMinDeadline$ = this.activePollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.minDeadline(); }); })
            .map(function (_) { return _ * 1000; })
            .catch(function () { return Observable_1.Observable.empty(); })
            .distinctUntilChanged()
            .share();
    }
    AdminComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.kudosTokenService$
            .subscribe(function (kudosTokenService) {
            kudosTokenService
                .checkUpdates(function (_) { return _.imOwner(); })
                .filter(function (imOnwer) { return !imOnwer; })
                .first()
                .subscribe(function () { return _this.router.navigate(['../'], { relativeTo: _this.activatedRoute }); });
        });
        this.kudosToken$
            .filter(function (_) { return !!_; })
            .subscribe(function (_a) {
            var members = _a.members;
            members.forEach(function (_a) {
                var member = _a.member, name = _a.name;
                return _this.memberName[member] = _this.memberName[member] || name;
            });
        });
        this.activatedRoute.params
            .first()
            .catch(function () { return Observable_1.Observable.empty(); })
            .subscribe(function (_a) {
            var address = _a.address, name = _a.name;
            if (address) {
                _this.newMember.member = address;
            }
            if (name) {
                _this.newMember.contact = name;
            }
            _this.newMember = __assign({}, _this.newMember);
        });
    };
    AdminComponent.prototype.isGoingToFinishOn = function (minutes) {
        var min = 60 * 1000;
        return Math.round(Date.now() / min) * min + (minutes * min);
    };
    AdminComponent.prototype.createPoll = function (form) {
        var _this = this;
        var done = function (success) { return _this.onActionFinished(success, _this.newPoll, function (_) { return _this.newPoll = _; }, form); };
        this.newPoll.working = true;
        this.kudosTokenService$
            .first()
            .subscribe(function (kudosTokenService) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = kudosTokenService).newPoll;
                        return [4 /*yield*/, kudosTokenService.fromDecimals(this.newPoll.kudosByMember)];
                    case 1:
                        _c = [_d.sent()];
                        return [4 /*yield*/, kudosTokenService.fromDecimals(this.newPoll.maxKudosToMember)];
                    case 2:
                        _b.apply(_a, _c.concat([_d.sent(),
                            this.newPoll.minDurationInMinutes]))
                            .then(function () { return done(true); })
                            .catch(function (err) { return console.warn(err) || done(); });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AdminComponent.prototype.closePoll = function () {
        var _this = this;
        var done = function (success) {
            _this.closePollWorking = undefined;
            _this.changeDetectorRef.markForCheck();
        };
        this.closePollWorking = true;
        this.kudosTokenService$
            .first()
            .subscribe(function (kudosTokenService) {
            kudosTokenService
                .closePoll()
                .then(function () { return done(true); })
                .catch(function (err) { return console.warn(err) || done(); });
        });
    };
    AdminComponent.prototype.addMember = function (form) {
        var _this = this;
        var done = function (success) { return _this.onActionFinished(success, _this.newMember, function (_) { return _this.newMember = _; }, form); };
        this.newMember.working = true;
        this.kudosTokenService$
            .first()
            .subscribe(function (kudosTokenService) {
            kudosTokenService
                .addMember(_this.newMember.member, _this.newMember.contact)
                .then(function () { return done(true); })
                .catch(function (err) { return console.warn(err) || done(); });
        });
    };
    AdminComponent.prototype.editContact = function (address, name) {
        var _this = this;
        var done = function (success) {
            _this.memberWorking[address] = undefined;
            _this.changeDetectorRef.markForCheck();
        };
        this.memberWorking[address] = true;
        this.kudosTokenService$
            .first()
            .subscribe(function (kudosTokenService) {
            kudosTokenService
                .editContact(address, name)
                .then(function () { return done(true); })
                .catch(function (err) { return console.warn(err) || done(); });
        });
    };
    AdminComponent.prototype.removeMember = function (address) {
        var _this = this;
        var done = function (success) {
            if (!success) {
                _this.memberWorking[address] = undefined;
                _this.changeDetectorRef.markForCheck();
            }
        };
        this.memberWorking[address] = true;
        this.kudosTokenService$
            .first()
            .subscribe(function (kudosTokenService) {
            kudosTokenService
                .removeMember(address)
                .then(function () { return done(true); })
                .catch(function (err) { return console.warn(err) || done(); });
        });
    };
    AdminComponent.prototype.onActionFinished = function (success, obj, setter, form) {
        if (success) {
            if (form) {
                setter({});
                form.reset();
            }
        }
        else {
            setter(__assign({}, obj, { working: undefined }));
        }
        this.changeDetectorRef.markForCheck();
    };
    AdminComponent.prototype.trackMember = function (index, _a) {
        var member = _a.member;
        return member || undefined;
    };
    AdminComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-admin',
            templateUrl: './admin.component.html',
            styleUrls: ['./admin.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [store_1.Store,
            shared_1.Web3Service,
            shared_1.KudosTokenFactoryService,
            router_1.Router,
            router_1.ActivatedRoute,
            core_1.ChangeDetectorRef])
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;
//# sourceMappingURL=admin.component.js.map