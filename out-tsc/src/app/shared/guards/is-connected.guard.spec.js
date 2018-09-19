"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var store_1 = require("@ngrx/store");
var web3_service_1 = require("../web3.service");
var is_connected_guard_1 = require("./is-connected.guard");
describe('IsConnectedGuard', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                testing_2.RouterTestingModule,
                store_1.StoreModule.forRoot({}),
            ],
            providers: [
                is_connected_guard_1.IsConnectedGuard,
                web3_service_1.Web3Service,
            ],
        });
    });
    it('should create', testing_1.inject([is_connected_guard_1.IsConnectedGuard], function (guard) {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=is-connected.guard.spec.js.map