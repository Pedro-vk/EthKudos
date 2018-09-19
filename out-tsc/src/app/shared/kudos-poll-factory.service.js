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
var kudos_poll_service_1 = require("./contracts/kudos-poll.service");
var KudosPollFactoryService = /** @class */ (function () {
    function KudosPollFactoryService(web3Service, store) {
        this.web3Service = web3Service;
        this.store = store;
        this.kudosPollInstances = {};
    }
    KudosPollFactoryService.prototype.getKudosPollServiceAt = function (address) {
        if (+address === 0) {
            return;
        }
        if (this.kudosPollInstances[address]) {
            return this.kudosPollInstances[address];
        }
        var kudosPollService = new kudos_poll_service_1.KudosPollService(this.web3Service, this.store);
        kudosPollService.initAt(address);
        this.kudosPollInstances[address] = kudosPollService;
        return kudosPollService;
    };
    KudosPollFactoryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, store_1.Store])
    ], KudosPollFactoryService);
    return KudosPollFactoryService;
}());
exports.KudosPollFactoryService = KudosPollFactoryService;
//# sourceMappingURL=kudos-poll-factory.service.js.map