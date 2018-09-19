"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/toPromise");
var KudosOrganisationsDefinition = require("../../../../build/contracts/KudosOrganisations.json");
var smart_contract_abstract_1 = require("./smart-contract.abstract");
var web3_service_1 = require("../web3.service");
var mixins_1 = require("./mixins");
web3_service_1.Web3Service.addABI(KudosOrganisationsDefinition.abi);
var KudosOrganisationsSmartContract = /** @class */ (function (_super) {
    __extends(KudosOrganisationsSmartContract, _super);
    function KudosOrganisationsSmartContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KudosOrganisationsSmartContract;
}(smart_contract_abstract_1.SmartContract));
var KudosOrganisationsService = /** @class */ (function (_super) {
    __extends(KudosOrganisationsService, _super);
    function KudosOrganisationsService(web3Service, store) {
        var _this = _super.call(this, web3Service, store) || this;
        _this.web3Service = web3Service;
        _this.store = store;
        // Events
        _this.NewOrganisation$ = _this.generateEventObservable('NewOrganisation');
        // Constants
        _this.getOrganisations = function () { return _this.generateConstant('getOrganisations')(); };
        _this.isInDirectory = function (address) { return _this.generateConstant('isInDirectory')(address); };
        _this.organisationIndex = function (address) { return _this.generateConstant('organisationIndex')(address); };
        // Actions
        _this.newOrganisation = function (tokenOrganisationName, tokenName, tokenSymbol, decimalUnits, addToDirectory) {
            return _this.generateAction('newOrganisation')(tokenOrganisationName, tokenName, tokenSymbol, decimalUnits, addToDirectory);
        };
        _this.removeOrganisation = function (address) { return _this.generateAction('removeOrganisation')(address); };
        _this.web3Service
            .status$
            .filter(function (status) { return status === web3_service_1.ConnectionStatus.Total; })
            .first()
            .subscribe(function () {
            var kudosOrganisation = _this.getContract(KudosOrganisationsDefinition);
            kudosOrganisation.deployed()
                .then(function (contract) {
                _this.web3Contract = _this.getWeb3Contract(KudosOrganisationsDefinition.abi, contract.address);
                _this.contract = contract;
                _this.initialized = true;
            });
        });
        return _this;
    }
    KudosOrganisationsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, store_1.Store])
    ], KudosOrganisationsService);
    return KudosOrganisationsService;
}(mixins_1.SmartContractExtender(KudosOrganisationsSmartContract, mixins_1.OwnableMixin)));
exports.KudosOrganisationsService = KudosOrganisationsService;
//# sourceMappingURL=kudos-organisations.service.js.map