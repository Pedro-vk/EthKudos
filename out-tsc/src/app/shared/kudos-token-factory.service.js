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
var web3_service_1 = require("./web3.service");
var kudos_token_service_1 = require("./contracts/kudos-token.service");
var kudos_poll_factory_service_1 = require("./kudos-poll-factory.service");
var KudosTokenFactoryService = /** @class */ (function () {
    function KudosTokenFactoryService(web3Service, store, kudosPollFactoryService) {
        this.web3Service = web3Service;
        this.store = store;
        this.kudosPollFactoryService = kudosPollFactoryService;
        this.kudosTokenInstances = {};
    }
    KudosTokenFactoryService.prototype.getKudosTokenServiceAt = function (address) {
        if (+address === 0) {
            return;
        }
        if (this.kudosTokenInstances[address]) {
            return this.kudosTokenInstances[address];
        }
        var kudosTokenService = new kudos_token_service_1.KudosTokenService(this.web3Service, this.store, this.kudosPollFactoryService);
        kudosTokenService.initAt(address);
        this.kudosTokenInstances[address] = kudosTokenService;
        return kudosTokenService;
    };
    KudosTokenFactoryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, store_1.Store, kudos_poll_factory_service_1.KudosPollFactoryService])
    ], KudosTokenFactoryService);
    return KudosTokenFactoryService;
}());
exports.KudosTokenFactoryService = KudosTokenFactoryService;
//# sourceMappingURL=kudos-token-factory.service.js.map