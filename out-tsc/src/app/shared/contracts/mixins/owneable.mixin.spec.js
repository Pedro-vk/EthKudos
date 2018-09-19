"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var web3_service_1 = require("../../web3.service");
var owneable_mixin_1 = require("./owneable.mixin");
describe('OwnableMixin', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                owneable_mixin_1.OwnableMixin,
                web3_service_1.Web3Service,
            ]
        });
    });
    it('should be created', testing_1.inject([owneable_mixin_1.OwnableMixin], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=owneable.mixin.spec.js.map