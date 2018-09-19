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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/share");
var web3_service_1 = require("../../web3.service");
var smart_contract_abstract_1 = require("../smart-contract.abstract");
var BasicTokenMixin = /** @class */ (function (_super) {
    __extends(BasicTokenMixin, _super);
    function BasicTokenMixin(web3Service) {
        var _this = _super.call(this, web3Service, undefined) || this;
        _this.web3Service = web3Service;
        return _this;
    }
    Object.defineProperty(BasicTokenMixin.prototype, "Transfer$", {
        // Events
        get: function () { return this.generateEventObservable('Transfer'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "name", {
        // Constants
        get: function () {
            var _this = this;
            return function () { return _this.generateConstant('name')(); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "symbol", {
        get: function () {
            var _this = this;
            return function () { return _this.generateConstant('symbol')(); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "decimals", {
        get: function () {
            var _this = this;
            return function () { return _this.generateConstant('decimals')(); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "totalSupply", {
        get: function () {
            var _this = this;
            return function () { return _this.generateConstant('totalSupply')(); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "balanceOf", {
        get: function () {
            var _this = this;
            return function (address) { return _this.generateConstant('balanceOf')(address); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicTokenMixin.prototype, "transfer", {
        // Actions
        get: function () {
            var _this = this;
            return function (to, value) { return _this.generateAction('transfer')(to, value); };
        },
        enumerable: true,
        configurable: true
    });
    // Helpers
    BasicTokenMixin.prototype.getTokenInfo = function () {
        var _this = this;
        return this
            .checkUpdates(function (contract) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, (contract.name || smart_contract_abstract_1.emptyPromise)()];
                    case 1:
                        _a.name = _b.sent();
                        return [4 /*yield*/, (contract.symbol || smart_contract_abstract_1.emptyPromise)()];
                    case 2:
                        _a.symbol = _b.sent();
                        return [4 /*yield*/, (contract.decimals || smart_contract_abstract_1.emptyPromise)()];
                    case 3: return [2 /*return*/, (_a.decimals = _b.sent(),
                            _a)];
                }
            });
        }); })
            .distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); })
            .share();
    };
    BasicTokenMixin.prototype.myBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, this.balanceOf(account)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BasicTokenMixin = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service])
    ], BasicTokenMixin);
    return BasicTokenMixin;
}(smart_contract_abstract_1.SmartContract));
exports.BasicTokenMixin = BasicTokenMixin;
//# sourceMappingURL=basic-token.mixin.js.map