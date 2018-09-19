"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var http_1 = require("@angular/common/http");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/animations");
var core_2 = require("@ngx-translate/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var environment_1 = require("../environments/environment");
var shared_1 = require("./shared");
var AppWrapperComponent = /** @class */ (function () {
    function AppWrapperComponent(web3Service, kudosTokenFactoryService, serviceWorkerService, translateService, http, router, title, localeId) {
        this.web3Service = web3Service;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.serviceWorkerService = serviceWorkerService;
        this.translateService = translateService;
        this.http = http;
        this.router = router;
        this.title = title;
        this.localeId = localeId;
        this.hasUpdates$ = this.serviceWorkerService.onUpdate.map(function () { return true; });
        translateService.setDefaultLang('en');
        translateService.use(localeId);
    }
    AppWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.web3Service.account$
            .mergeMap(function (account) {
            return _this.web3Service.getEthBalance()
                .filter(function (balance) { return balance <= 1; })
                .map(function () { return account; });
        })
            .subscribe(function (account) {
            _this.claimTestEtherOnRopsten(account);
        });
        this.router.events
            .subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                window.scrollTo(0, 0);
                _this.setTitleByUrl(event.urlAfterRedirects)
                    .then(function () {
                    if (environment_1.environment.production && window.ga) {
                        window.ga('set', 'page', event.urlAfterRedirects);
                        window.ga('send', 'pageview');
                    }
                });
            }
        });
        var loading = document.getElementById('loading-wrapper');
        loading.parentNode.removeChild(loading);
    };
    AppWrapperComponent.prototype.setTitleByUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var segmenets, base, title;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        segmenets = url.split('/').slice(1).concat([undefined, undefined, undefined]);
                        base = 'EthKudos - ';
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, kudosTokenService_1, orgName, _b, pollingNumber;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = true;
                                            switch (_a) {
                                                case !!segmenets[0].match(/^0x[0-9a-fA-F]{40}$/): return [3 /*break*/, 1];
                                                case segmenets[0] === 'faqs': return [3 /*break*/, 9];
                                                case segmenets[0] === 'donate': return [3 /*break*/, 10];
                                                case segmenets[0] === 'privacy-policy': return [3 /*break*/, 11];
                                            }
                                            return [3 /*break*/, 12];
                                        case 1:
                                            kudosTokenService_1 = this.kudosTokenFactoryService.getKudosTokenServiceAt(segmenets[0]);
                                            return [4 /*yield*/, kudosTokenService_1.onIsValid
                                                    .mergeMap(function () { return Observable_1.Observable.fromPromise(kudosTokenService_1.name()); })
                                                    .first()
                                                    .catch(function () { return Observable_1.Observable.empty(); })
                                                    .toPromise()];
                                        case 2:
                                            orgName = _c.sent();
                                            _b = true;
                                            switch (_b) {
                                                case segmenets[1] === 'faqs': return [3 /*break*/, 3];
                                                case segmenets[1] === 'admin': return [3 /*break*/, 4];
                                                case segmenets[1] === 'active': return [3 /*break*/, 5];
                                                case segmenets[1] === 'closed': return [3 /*break*/, 6];
                                            }
                                            return [3 /*break*/, 8];
                                        case 3: return [2 /*return*/, orgName + " - FAQs"];
                                        case 4: return [2 /*return*/, orgName + " - Admin"];
                                        case 5: return [2 /*return*/, orgName + " - Active polling"];
                                        case 6: return [4 /*yield*/, kudosTokenService_1.getPreviousPolls()];
                                        case 7:
                                            pollingNumber = (_c.sent()).indexOf(segmenets[2]);
                                            return [2 /*return*/, orgName + " - Polling #" + (pollingNumber + 1)];
                                        case 8: return [2 /*return*/, orgName];
                                        case 9: return [2 /*return*/, 'FAQs'];
                                        case 10: return [2 /*return*/, 'Donate'];
                                        case 11: return [2 /*return*/, 'Privacy Policy'];
                                        case 12: return [2 /*return*/, "Time to reward"];
                                    }
                                });
                            }); })()];
                    case 1:
                        title = _a.sent();
                        this.title.setTitle(base + title);
                        return [2 /*return*/];
                }
            });
        });
    };
    AppWrapperComponent.prototype.claimTestEtherOnRopsten = function (account) {
        console.log('Claim -> ', account);
        this.http.post('https://faucet.metamask.io', account, { responseType: 'text' })
            .subscribe(function () { return console.log('Claim done!'); });
    };
    AppWrapperComponent.prototype.reload = function () {
        window.location.reload();
    };
    AppWrapperComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-root',
            templateUrl: './app-wrapper.component.html',
            styleUrls: ['./app-wrapper.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            animations: [
                animations_1.trigger('updatesIn', [
                    animations_1.transition(':enter', [
                        animations_1.style({ opacity: 0, bottom: '-40px' }),
                        animations_1.animate('.3s ease-in-out', animations_1.style({ opacity: 1, bottom: '*' })),
                    ]),
                ]),
            ],
        }),
        __param(7, core_1.Inject(core_1.LOCALE_ID)),
        __metadata("design:paramtypes", [shared_1.Web3Service,
            shared_1.KudosTokenFactoryService,
            shared_1.ServiceWorkerService,
            core_2.TranslateService,
            http_1.HttpClient,
            router_1.Router,
            platform_browser_1.Title, String])
    ], AppWrapperComponent);
    return AppWrapperComponent;
}());
exports.AppWrapperComponent = AppWrapperComponent;
//# sourceMappingURL=app-wrapper.component.js.map