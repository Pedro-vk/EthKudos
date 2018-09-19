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
var typescript_mix_1 = require("typescript-mix");
var smart_contract_abstract_1 = require("../smart-contract.abstract");
function SmartContractExtender() {
    var mixins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mixins[_i] = arguments[_i];
    }
    var klass = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return class_1;
    }(smart_contract_abstract_1.SmartContract));
    typescript_mix_1.use.apply(void 0, mixins.reverse())(new klass(), undefined);
    return klass;
}
exports.SmartContractExtender = SmartContractExtender;
//# sourceMappingURL=smart-contract-extender.helper.js.map