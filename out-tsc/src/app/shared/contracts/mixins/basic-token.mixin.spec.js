"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var web3_service_1 = require("../../web3.service");
var basic_token_mixin_1 = require("./basic-token.mixin");
describe('BasicTokenMixin', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                basic_token_mixin_1.BasicTokenMixin,
                web3_service_1.Web3Service,
            ]
        });
    });
    it('should be created', testing_1.inject([basic_token_mixin_1.BasicTokenMixin], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=basic-token.mixin.spec.js.map