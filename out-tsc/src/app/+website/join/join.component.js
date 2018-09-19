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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var store_1 = require("@ngrx/store");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var fromRoot = require("../../shared/store/reducers");
var kudosTokenActions = require("../../shared/store/kudos-token/kudos-token.actions");
var shared_1 = require("../../shared");
var JoinComponent = /** @class */ (function () {
    function JoinComponent(store, activatedRoute) {
        var _this = this;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.joinName$ = new Subject_1.Subject();
        this.status$ = this.store.select(fromRoot.getStatus);
        this.account$ = this.store.select(fromRoot.getAccount);
        this.kudosTokenInfo$ = this.activatedRoute.params
            .mergeMap(function (_a) {
            var tokenAddress = _a.tokenAddress;
            return _this.getKudosTokenInfo(tokenAddress);
        })
            .shareReplay();
        this.adminJoinUrl$ = this.joinName$
            .startWith(undefined)
            .combineLatest(this.store.select(fromRoot.getAccount), this.activatedRoute.params)
            .map(function (_a) {
            var name = _a[0], account = _a[1], tokenAddress = _a[2].tokenAddress;
            return "https://eth-kudos.com/" + tokenAddress + "/admin;address=" + account + (name ? ";name=" + name : '');
        })
            .map(function (url) { return encodeURI(url); })
            .distinctUntilChanged()
            .shareReplay();
    }
    JoinComponent.prototype.copyJoinUrl = function () {
        var _this = this;
        this.copied = true;
        this.joinUrlElement.nativeElement.select();
        document.execCommand('copy');
        setTimeout(function () { return _this.copied = false; }, 2000);
    };
    JoinComponent.prototype.getKudosTokenInfo = function (address) {
        this.store.dispatch(new kudosTokenActions.LoadBasicDataAction(address));
        this.store.dispatch(new kudosTokenActions.LoadTotalDataAction(address));
        return this.store.select(fromRoot.getKudosTokenByAddressWithAccountData(address));
    };
    __decorate([
        core_1.ViewChild('joinUrl'),
        __metadata("design:type", core_1.ElementRef)
    ], JoinComponent.prototype, "joinUrlElement", void 0);
    JoinComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-join',
            templateUrl: './join.component.html',
            styleUrls: ['./join.component.scss'],
            animations: [shared_1.cardInOutAnimation],
        }),
        __metadata("design:paramtypes", [store_1.Store,
            router_1.ActivatedRoute])
    ], JoinComponent);
    return JoinComponent;
}());
exports.JoinComponent = JoinComponent;
//# sourceMappingURL=join.component.js.map