"use strict";
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
var Web3Module = require("web3");
var truffleContract = require("truffle-contract");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/share");
var environment_1 = require("../../../environments/environment");
var accountActions = require("../store/account/account.actions");
exports.emptyPromise = function () { return Promise.resolve(undefined); };
var SmartContract = /** @class */ (function () {
    function SmartContract(web3Service, store) {
        this.web3Service = web3Service;
        this.store = store;
        this._onInitialized = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.onInitialized = this._onInitialized.filter(function (_) { return !!_; });
        this.isBigNumber = function (_) { return (new Web3Module()).utils.isBigNumber(_) || (new Web3Module()).utils.isBN(_); };
    }
    Object.defineProperty(SmartContract.prototype, "initialized", {
        get: function () {
            return !!this.contract;
        },
        set: function (value) {
            if (value) {
                this._onInitialized.next(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SmartContract.prototype, "address", {
        get: function () {
            return (this.contract || {}).address;
        },
        enumerable: true,
        configurable: true
    });
    SmartContract.prototype.checkUpdates = function (fn) {
        var _this = this;
        return Observable_1.Observable
            .merge(this.web3Service.changes$, this.onInitialized)
            .filter(function () { return _this.initialized; })
            .mergeMap(function () { return Observable_1.Observable.fromPromise(fn(_this)); })
            .distinctUntilChanged()
            .catch(function (e) { return console.warn('checkUpdates error: ', { fn: fn, e: e }) || Observable_1.Observable.empty(); })
            .share();
    };
    SmartContract.prototype.fromDecimals = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var decimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (this.contract.decimals || exports.emptyPromise)()];
                    case 1:
                        decimals = _a.sent();
                        return [2 /*return*/, value * (Math.pow(10, decimals))];
                }
            });
        });
    };
    SmartContract.prototype.fromInt = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var decimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (this.contract.decimals || exports.emptyPromise)()];
                    case 1:
                        decimals = _a.sent();
                        return [2 /*return*/, value / (Math.pow(10, decimals))];
                }
            });
        });
    };
    SmartContract.prototype.getContract = function (smartContractDescriptor) {
        var contractLoader = truffleContract(smartContractDescriptor);
        contractLoader.setProvider(this.web3Service.web3.currentProvider);
        return contractLoader;
    };
    SmartContract.prototype.getWeb3Contract = function (abi, address) {
        return new this.web3Service.web3.eth.Contract(abi, address);
    };
    SmartContract.prototype.generateConstant = function (constant, mapper) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var _a;
                if (!_this.contract) {
                    resolve(undefined);
                    return;
                }
                (_a = _this.contract)[constant].apply(_a, args).then(function (result) {
                    if (_this.isBigNumber(result)) {
                        result = +result;
                    }
                    if (result instanceof Array) {
                        result = result.map(function (_) { return _this.isBigNumber(_) ? +_ : _; });
                    }
                    resolve(mapper ? mapper(result) : result);
                });
            });
        };
    };
    SmartContract.prototype.generateConstantIteration = function (lengthFn, getter) {
        return __awaiter(this, void 0, void 0, function () {
            var length;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lengthFn()];
                    case 1:
                        length = _a.sent();
                        return [4 /*yield*/, Promise.all(Array.from(new Array(+length))
                                .map(function (_, i) { return getter(i); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SmartContract.prototype.generateAction = function (action) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var subject = new Subject_1.Subject();
            var promise = new Promise(function (resolve, reject) {
                var _a;
                var tx;
                var config = { from: _this.web3Service.account };
                if (environment_1.environment.defaultGasLimit) {
                    config.gas = environment_1.environment.defaultGasLimit;
                }
                (_a = _this.web3Contract.methods)[action].apply(_a, args).send(config)
                    .on('transactionHash', function (txHash) {
                    tx = txHash;
                    subject.next('waiting');
                    _this.store.dispatch(new accountActions.AddNewTransactionAction(tx));
                })
                    .on('confirmation', function (confirmations) {
                    _this.store.dispatch(new accountActions.SetTransactionConfirmationsAction(tx, confirmations));
                })
                    .on('error', function (error) {
                    subject.next('error');
                    reject({ error: error });
                })
                    .then(function (receipt) {
                    subject.next('done');
                    resolve(receipt);
                });
            });
            promise.$observable = subject.asObservable();
            return promise;
        };
    };
    SmartContract.prototype.generateEventObservable = function (event) {
        var _this = this;
        return this.onInitialized
            .mergeMap(function () {
            return Observable_1.Observable
                .create(function (observer) { return _this.contract[event]().watch(function (e, _) { return observer.next(_.args); }); })
                .share();
        });
    };
    return SmartContract;
}());
exports.SmartContract = SmartContract;
//# sourceMappingURL=smart-contract.abstract.js.map