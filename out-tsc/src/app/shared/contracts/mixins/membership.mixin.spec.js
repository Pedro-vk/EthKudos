"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var web3_service_1 = require("../../web3.service");
var membership_mixin_1 = require("./membership.mixin");
describe('MembershipMixin', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                membership_mixin_1.MembershipMixin,
                web3_service_1.Web3Service,
            ]
        });
    });
    it('should be created', testing_1.inject([membership_mixin_1.MembershipMixin], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=membership.mixin.spec.js.map