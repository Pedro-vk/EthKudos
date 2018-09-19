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
require("rxjs/add/operator/do");
require("rxjs/add/operator/first");
var kudos_token_factory_service_1 = require("../kudos-token-factory.service");
var IsTokenGuard = /** @class */ (function () {
    function IsTokenGuard(kudosTokenFactoryService, router) {
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.router = router;
    }
    IsTokenGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        var tokenAddress = next.params.tokenAddress || next.parent.params.tokenAddress;
        var kudosTokenService = this.kudosTokenFactoryService
            .getKudosTokenServiceAt(tokenAddress);
        return kudosTokenService
            .onIsValid
            .first()
            .do(function (isValid) {
            if (!isValid) {
                _this.router.navigate(['/']);
            }
        });
    };
    IsTokenGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [kudos_token_factory_service_1.KudosTokenFactoryService, router_1.Router])
    ], IsTokenGuard);
    return IsTokenGuard;
}());
exports.IsTokenGuard = IsTokenGuard;
//# sourceMappingURL=is-token.guard.js.map