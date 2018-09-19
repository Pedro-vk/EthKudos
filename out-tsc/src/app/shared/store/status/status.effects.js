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
var effects_1 = require("@ngrx/effects");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
var web3_service_1 = require("../../web3.service");
var statusActions = require("./status.actions");
var StatusEffects = /** @class */ (function () {
    function StatusEffects(actions$, web3Service) {
        var _this = this;
        this.actions$ = actions$;
        this.web3Service = web3Service;
        this.watchStatusChanges$ = this.actions$
            .ofType(effects_1.ROOT_EFFECTS_INIT)
            .first()
            .mergeMap(function () { return _this.getWeb3Status(); })
            .map(function (status) { return new statusActions.SetStatusAction(status); });
    }
    StatusEffects.prototype.getWeb3Status = function () {
        return this.web3Service.status$;
    };
    __decorate([
        effects_1.Effect(),
        __metadata("design:type", Observable_1.Observable)
    ], StatusEffects.prototype, "watchStatusChanges$", void 0);
    StatusEffects = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [effects_1.Actions, web3_service_1.Web3Service])
    ], StatusEffects);
    return StatusEffects;
}());
exports.StatusEffects = StatusEffects;
//# sourceMappingURL=status.effects.js.map