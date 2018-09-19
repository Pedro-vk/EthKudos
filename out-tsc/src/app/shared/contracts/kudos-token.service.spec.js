"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_1 = require("@ngrx/store");
var web3_service_1 = require("../web3.service");
var kudos_poll_factory_service_1 = require("../kudos-poll-factory.service");
var kudos_token_service_1 = require("./kudos-token.service");
describe('KudosTokenService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot({}),
            ],
            providers: [
                kudos_token_service_1.KudosTokenService,
                web3_service_1.Web3Service,
                kudos_poll_factory_service_1.KudosPollFactoryService,
            ],
        });
    });
    it('should be created', testing_1.inject([kudos_token_service_1.KudosTokenService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=kudos-token.service.spec.js.map