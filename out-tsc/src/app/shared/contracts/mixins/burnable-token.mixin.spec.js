"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var web3_service_1 = require("../../web3.service");
var burnable_token_mixin_1 = require("./burnable-token.mixin");
describe('BurnableTokenMixin', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                burnable_token_mixin_1.BurnableTokenMixin,
                web3_service_1.Web3Service,
            ]
        });
    });
    it('should be created', testing_1.inject([burnable_token_mixin_1.BurnableTokenMixin], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=burnable-token.mixin.spec.js.map