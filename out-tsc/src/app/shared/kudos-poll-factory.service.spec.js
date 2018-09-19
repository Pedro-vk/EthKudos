"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_1 = require("@ngrx/store");
var web3_service_1 = require("./web3.service");
var kudos_poll_factory_service_1 = require("./kudos-poll-factory.service");
describe('KudosPollFactoryService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot({}),
            ],
            providers: [
                kudos_poll_factory_service_1.KudosPollFactoryService,
                web3_service_1.Web3Service,
            ]
        });
    });
    it('should be created', testing_1.inject([kudos_poll_factory_service_1.KudosPollFactoryService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=kudos-poll-factory.service.spec.js.map