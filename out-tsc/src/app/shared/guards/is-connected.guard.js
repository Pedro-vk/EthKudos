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
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
var web3_service_1 = require("../web3.service");
var IsConnectedGuard = /** @class */ (function () {
    function IsConnectedGuard(web3Service, router) {
        this.web3Service = web3Service;
        this.router = router;
    }
    IsConnectedGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return this.web3Service
            .status$
            .first()
            .map(function (status) {
            var connected = _this.web3Service.status === web3_service_1.ConnectionStatus.Total;
            if (!connected) {
                _this.router.navigate(['/error', status]);
            }
            return connected;
        });
    };
    IsConnectedGuard.prototype.canActivateChild = function (next, state) {
        return this.canActivate(next, state);
    };
    IsConnectedGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, router_1.Router])
    ], IsConnectedGuard);
    return IsConnectedGuard;
}());
exports.IsConnectedGuard = IsConnectedGuard;
//# sourceMappingURL=is-connected.guard.js.map