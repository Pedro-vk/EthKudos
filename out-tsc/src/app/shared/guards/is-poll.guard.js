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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/do");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var kudos_token_factory_service_1 = require("../kudos-token-factory.service");
var IsPollGuard = /** @class */ (function () {
    function IsPollGuard(kudosTokenFactoryService, router) {
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.router = router;
    }
    IsPollGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        var tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
        var pollAddress = next.params.address;
        var kudosTokenService = this.kudosTokenFactoryService
            .getKudosTokenServiceAt(tokenAddress);
        return kudosTokenService
            .onInitialized
            .first()
            .mergeMap(function () { return Observable_1.Observable.fromPromise(kudosTokenService.getPreviousPolls()); })
            .map(function (polls) { return polls.indexOf(pollAddress) !== -1; })
            .do(function (imOwner) {
            if (!imOwner) {
                _this.router.navigate([state.url.split('/').slice(0, -2).join('/')]);
            }
        });
    };
    IsPollGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [kudos_token_factory_service_1.KudosTokenFactoryService, router_1.Router])
    ], IsPollGuard);
    return IsPollGuard;
}());
exports.IsPollGuard = IsPollGuard;
//# sourceMappingURL=is-poll.guard.js.map