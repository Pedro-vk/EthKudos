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
require("rxjs/add/operator/delay");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var shared_1 = require("../../../shared");
var components_1 = require("../../../components");
var PollChartComponent = /** @class */ (function () {
    function PollChartComponent(activatedRoute, kudosTokenFactoryService, kudosPollFactoryService, changeDetectorRef) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.kudosPollFactoryService = kudosPollFactoryService;
        this.changeDetectorRef = changeDetectorRef;
        this.loaded = false;
        this.kudosTokenService$ = this.activatedRoute.parent.params
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .filter(function (_) { return !!_; })
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
        this.gratitudesEdges$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.allGratitudes(); }); })
            .first()
            .combineLatest(this.kudosTokenService$)
            .first()
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
                        case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.kudos = _c.sent(), _b)])))];
                    }
                });
            }); });
        })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
            .map(function (gratitudes) { return gratitudes.map(function (_a) {
            var from = _a.from, to = _a.to, kudos = _a.kudos, message = _a.message;
            return [from, to, kudos, message];
        }); })
            .distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); })
            .catch(function () { return Observable_1.Observable.empty(); })
            .shareReplay();
        this.gratitudesNodes$ = this.pollContract$
            .mergeMap(function (kudosPollService) { return kudosPollService.checkUpdates(function (_) { return _.getMembers(); }); })
            .first()
            .combineLatest(this.kudosTokenService$)
            .map(function (_a) {
            var members = _a[0], kudosTokenService = _a[1];
            return members.map(function (member) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = { member: member };
                        return [4 /*yield*/, kudosTokenService.getContact(member)];
                    case 1: return [2 /*return*/, (_a.name = _b.sent(), _a)];
                }
            }); }); });
        })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(Promise.all(_)); })
            .distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); })
            .map(function (nodes) {
            return nodes
                .map(function (_a) {
                var member = _a.member, name = _a.name;
                return ({
                    id: member,
                    name: name,
                    address: member,
                });
            })
                .sort(function (a, b) { return +a.address - +b.address; })
                .map(function (data) { return ({ data: data }); });
        })
            .catch(function () { return Observable_1.Observable.empty(); })
            .shareReplay();
    }
    PollChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gratitudesNodes$
            .combineLatest(this.gratitudesEdges$)
            .first()
            .catch(function () { return Observable_1.Observable.empty(); })
            .delay(10)
            .subscribe(function () {
            _this.loaded = true;
            _this.graph.ngOnInit();
            _this.changeDetectorRef.markForCheck();
        });
    };
    PollChartComponent.prototype.resize = function () {
        this.graph.cyResize();
    };
    PollChartComponent.prototype.setLayout = function (layout) {
        this.graph.setLayout(layout);
    };
    __decorate([
        core_1.ViewChild('graph'),
        __metadata("design:type", components_1.GraphComponent)
    ], PollChartComponent.prototype, "graph", void 0);
    __decorate([
        core_1.ViewChild('wrapper'),
        __metadata("design:type", core_1.ElementRef)
    ], PollChartComponent.prototype, "wrapper", void 0);
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PollChartComponent.prototype, "resize", null);
    PollChartComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-poll-chart',
            templateUrl: './poll-chart.component.html',
            styleUrls: ['./poll-chart.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            shared_1.KudosTokenFactoryService,
            shared_1.KudosPollFactoryService,
            core_1.ChangeDetectorRef])
    ], PollChartComponent);
    return PollChartComponent;
}());
exports.PollChartComponent = PollChartComponent;
//# sourceMappingURL=poll-chart.component.js.map