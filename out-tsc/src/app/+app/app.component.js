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
var http_1 = require("@angular/common/http");
var animations_1 = require("@angular/animations");
var material_1 = require("@angular/material");
var store_1 = require("@ngrx/store");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
var shared_1 = require("../shared");
var components_1 = require("../components");
var fromRoot = require("../shared/store/reducers");
var AppComponent = /** @class */ (function () {
    function AppComponent(store, web3Service, kudosTokenFactoryService, http, router, activatedRoute, matDialog) {
        var _this = this;
        this.store = store;
        this.web3Service = web3Service;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.http = http;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.matDialog = matDialog;
        this.canBeShared = !!navigator.share;
        this.status$ = this.store.select(fromRoot.getStatus);
        this.account$ = this.store.select(fromRoot.getAccount);
        this.pendingTransactions$ = this.store.select(fromRoot.getPendingTransactions);
        this.balance$ = this.store.select(fromRoot.getBalance);
        this.kudosTokenService$ = this.activatedRoute.params
            .map(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.kudosTokenFactoryService.getKudosTokenServiceAt(tokenAddress);
        })
            .shareReplay();
        this.kudosToken$ = this.store.select(fromRoot.getCurrentKudosTokenWithAccountData);
    }
    AppComponent.prototype.ngOnInit = function () {
        this.kudosTokenService$
            .mergeMap(function (kudosTokenService) { return kudosTokenService.onInitialized.map(function () { return kudosTokenService; }); })
            .subscribe(function (kudosTokenService) {
            if (localStorage && kudosTokenService.address) {
                localStorage.setItem('kudos-address', kudosTokenService.address);
            }
        });
    };
    AppComponent.prototype.goToEtherscan = function (tx) {
        this.web3Service.goToEtherscan(tx);
    };
    AppComponent.prototype.openShareDialog = function () {
        var _this = this;
        this.activatedRoute.params
            .subscribe(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.matDialog.open(components_1.ShareDialogComponent, { data: tokenAddress });
        });
    };
    AppComponent.prototype.share = function () {
        var _this = this;
        if (navigator.share) {
            this.openShareDialog();
            return;
        }
        this.kudosTokenService$
            .mergeMap(function (kudosTokenService) { return kudosTokenService.onInitialized.map(function () { return kudosTokenService; }); })
            .map(function (kudosTokenService) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = (_a = navigator).share;
                        _c = {};
                        _d = "Join ";
                        return [4 /*yield*/, kudosTokenService.name()];
                    case 1:
                        _b.apply(_a, [(_c.title = _d + (_e.sent()),
                                _c.url = "{document.location.origin}/" + kudosTokenService.address,
                                _c)])
                            .then(function () { })
                            .catch(function () { });
                        return [2 /*return*/];
                }
            });
        }); })
            .subscribe(function (proimise) { return proimise.then(function () { }); });
    };
    AppComponent.prototype.routeIs = function (url) {
        return this.router.url.split('/').slice(2).join('/') === url.replace(/^\//, '');
    };
    AppComponent.prototype.trackTransaction = function (index, transaction) {
        return transaction.hash || undefined;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-app',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            animations: [
                animations_1.trigger('easeInOut', [
                    animations_1.transition(':enter', [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('.3s ease-in-out', animations_1.style({ opacity: 1 })),
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.style({ opacity: 1 }),
                        animations_1.animate('.3s ease-in-out', animations_1.style({ opacity: 0 })),
                    ]),
                ]),
            ],
        }),
        __metadata("design:paramtypes", [store_1.Store,
            shared_1.Web3Service,
            shared_1.KudosTokenFactoryService,
            http_1.HttpClient,
            router_1.Router,
            router_1.ActivatedRoute,
            material_1.MatDialog])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map