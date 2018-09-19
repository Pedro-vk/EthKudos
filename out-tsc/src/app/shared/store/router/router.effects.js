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
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var router_store_1 = require("@ngrx/router-store");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/distinct");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var fromRoot = require("../reducers");
var kudosPollActions = require("../kudos-poll/kudos-poll.actions");
var kudosTokenActions = require("../kudos-token/kudos-token.actions");
var RouterEffects = /** @class */ (function () {
    function RouterEffects(actions$, store) {
        var _this = this;
        this.actions$ = actions$;
        this.store = store;
        this.loadKudosTokenOnOpen$ = this.actions$
            .ofType(router_store_1.ROUTER_NAVIGATION)
            .map(function (_a) {
            var payload = _a.payload;
            return payload;
        })
            .map(function (_a) {
            var routerState = _a.routerState;
            return routerState.root.firstChild && routerState.root.firstChild.params.tokenAddress;
        })
            .filter(function (_) { return !!_; })
            .distinctUntilChanged()
            .mergeMap(function (address) {
            return Observable_1.Observable.merge(Observable_1.Observable.from([
                new kudosTokenActions.LoadBasicDataAction(address),
                new kudosTokenActions.LoadTotalDataAction(address),
            ]), _this.store.select(fromRoot.getKudosTokenPolls(address))
                .mergeMap(function (kudosPolls) { return Observable_1.Observable.from(kudosPolls || []); })
                .distinct()
                .mergeMap(function (kudosPollAddress) { return Observable_1.Observable.from([
                new kudosPollActions.LoadBasicDataAction(address),
                new kudosPollActions.LoadDynamicDataAction(address),
            ]); }));
        });
    }
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], RouterEffects.prototype, "loadKudosTokenOnOpen$", void 0);
    RouterEffects = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [effects_1.Actions, store_1.Store])
    ], RouterEffects);
    return RouterEffects;
}());
exports.RouterEffects = RouterEffects;
//# sourceMappingURL=router.effects.js.map