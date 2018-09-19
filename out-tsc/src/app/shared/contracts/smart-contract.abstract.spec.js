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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_1 = require("@ngrx/store");
var Web3Module = require("web3");
var web3_service_1 = require("../web3.service");
var smart_contract_abstract_1 = require("./smart-contract.abstract");
var SmartContractExtended = /** @class */ (function (_super) {
    __extends(SmartContractExtended, _super);
    function SmartContractExtended() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SmartContractExtended;
}(smart_contract_abstract_1.SmartContract));
describe('SmartContract', function () {
    var newBN = function (n) { return new (new Web3Module()).utils.BN(n); };
    var smartContract;
    var web3Service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                store_1.StoreModule.forRoot({}),
            ],
            providers: [
                web3_service_1.Web3Service,
            ],
        });
    });
    beforeEach(testing_1.inject([web3_service_1.Web3Service, store_1.Store], function (_web3Service, _store) {
        web3Service = _web3Service;
        smartContract = new SmartContractExtended(_web3Service, _store);
    }));
    it('should be created', function () {
        expect(smartContract).toBeTruthy();
    });
    it('should generate a constant getter that returns undefined if have not contract', function (done) {
        smartContract.testConstant = function () { return smartContract.generateConstant('testConstant')(); };
        smartContract.testConstant()
            .then(function (_) {
            expect(_).toBeUndefined();
            done();
        });
    });
    it('should generate a constant getter that returns values', function (done) {
        var testValueConstantSpy = jasmine.createSpy('testValueConstant');
        var testBigNumberConstantSpy = jasmine.createSpy('testBigNumberConstant');
        var testArrayConstantSpy = jasmine.createSpy('testArrayConstant');
        var testArgsConstantSpy = jasmine.createSpy('testArgsConstant');
        smartContract.contract = {
            testValueConstant: testValueConstantSpy.and.returnValue(new Promise(function (resolve) { return resolve('testValue'); })),
            testBigNumberConstant: testBigNumberConstantSpy.and.returnValue(new Promise(function (resolve) { return resolve(newBN(100)); })),
            testArrayConstant: testArrayConstantSpy.and.returnValue(new Promise(function (resolve) { return resolve(['abc', newBN(100)]); })),
            testArgsConstant: testArgsConstantSpy.and.callFake(function (_) { return new Promise(function (resolve) { return resolve(_); }); }),
        };
        smartContract.testValueConstant = function () { return smartContract.generateConstant('testValueConstant')(); };
        smartContract.testBigNumberConstant = function () { return smartContract.generateConstant('testBigNumberConstant')(); };
        smartContract.testArrayConstant = function () { return smartContract.generateConstant('testArrayConstant', function (_a) {
            var a = _a[0], b = _a[1];
            return [a, +b];
        })(); };
        smartContract.testArgsConstant = function (_) { return smartContract.generateConstant('testArgsConstant')(_); };
        smartContract.testValueConstant()
            .then(function (_) {
            expect(_).toEqual('testValue');
            expect(testValueConstantSpy).toHaveBeenCalled();
        });
        smartContract.testBigNumberConstant()
            .then(function (_) {
            expect(_).toEqual(100);
            expect(testBigNumberConstantSpy).toHaveBeenCalled();
        });
        smartContract.testArrayConstant()
            .then(function (_) {
            expect(_).toEqual(['abc', 100]);
            expect(testArrayConstantSpy).toHaveBeenCalled();
        });
        smartContract.testArgsConstant('args')
            .then(function (_) {
            expect(_).toEqual('args');
            expect(testArgsConstantSpy).toHaveBeenCalled();
        });
        setTimeout(function () { return done(); }, 1000);
    });
    it('should generate a constant iterator getter', function (done) {
        var testCountSpy = jasmine.createSpy('testCount').and.returnValue(new Promise(function (resolve) { return resolve(2); }));
        var testValueConstantSpy = jasmine.createSpy('testValueConstant').and.callFake(function (n) { return new Promise(function (resolve) { return resolve(n * 10); }); });
        smartContract.generateConstantIteration(testCountSpy, testValueConstantSpy)
            .then(function (_) {
            expect(_).toEqual([0, 10]);
            expect(testCountSpy).toHaveBeenCalled();
            expect(testValueConstantSpy).toHaveBeenCalledTimes(2);
            done();
        });
    });
});
//# sourceMappingURL=smart-contract.abstract.spec.js.map