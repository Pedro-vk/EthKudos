"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var store_1 = require("@ngrx/store");
var web3_service_1 = require("../web3.service");
var kudos_token_factory_service_1 = require("../kudos-token-factory.service");
var kudos_poll_factory_service_1 = require("../kudos-poll-factory.service");
var is_token_guard_1 = require("./is-token.guard");
describe('IsTokenGuard', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                testing_2.RouterTestingModule,
                store_1.StoreModule.forRoot({}),
            ],
            providers: [
                is_token_guard_1.IsTokenGuard,
                web3_service_1.Web3Service,
                kudos_token_factory_service_1.KudosTokenFactoryService,
                kudos_poll_factory_service_1.KudosPollFactoryService,
            ],
        });
    });
    it('should create', testing_1.inject([is_token_guard_1.IsTokenGuard], function (guard) {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=is-token.guard.spec.js.map