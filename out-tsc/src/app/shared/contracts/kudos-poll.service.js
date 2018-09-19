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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var store_1 = require("@ngrx/store");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
var KudosPollDefinition = require("../../../../build/contracts/KudosPoll.json");
var smart_contract_abstract_1 = require("./smart-contract.abstract");
var web3_service_1 = require("../web3.service");
var mixins_1 = require("./mixins");
web3_service_1.Web3Service.addABI(KudosPollDefinition.abi);
var KudosPollSmartContract = /** @class */ (function (_super) {
    __extends(KudosPollSmartContract, _super);
    function KudosPollSmartContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KudosPollSmartContract;
}(smart_contract_abstract_1.SmartContract));
var KudosPollService = /** @class */ (function (_super) {
    __extends(KudosPollService, _super);
    function KudosPollService(web3Service, store) {
        var _this = _super.call(this, web3Service, store) || this;
        _this.web3Service = web3Service;
        _this.store = store;
        // Events
        _this.Close$ = _this.generateEventObservable('Close');
        _this.Reward$ = _this.generateEventObservable('Reward');
        // Constants
        _this.version = function () { return _this.generateConstant('version')(); };
        _this.active = function () { return _this.generateConstant('active')(); };
        _this.kudosByMember = function () { return _this.generateConstant('kudosByMember')(); };
        _this.maxKudosToMember = function () { return _this.generateConstant('maxKudosToMember')(); };
        _this.members = function () { return _this.generateConstant('members')(); };
        _this.minDeadline = function () { return _this.generateConstant('minDeadline')(); };
        _this.creation = function () { return _this.generateConstant('creation')(); };
        _this.canBeClosed = function () { return _this.generateConstant('canBeClosed')(); };
        _this.getGratitudeOf = function (member, index) {
            return _this.generateConstant('getGratitudeOf', function (_a) {
                var kudos = _a[0], message = _a[1], from = _a[2];
                return ({ kudos: kudos, message: message, from: from });
            })(member, index);
        };
        _this.getGratitudesSizeOf = function (member) { return _this.generateConstant('getGratitudesSizeOf')(member); };
        _this.getKudosOf = function (member) { return _this.generateConstant('getKudosOf')(member); };
        _this.getPollResult = function (index) { return _this.generateConstant('getPollResult', function (_a) {
            var member = _a[0], kudos = _a[1];
            return ({ member: member, kudos: kudos });
        })(index); };
        _this.getPollResultsSize = function () { return _this.generateConstant('getPollResultsSize')(); };
        // Constant iterators
        _this.getBalances = function () { return _this.generateConstantIteration(function () { return _this.membersNumber(); }, function (i) { return __awaiter(_this, void 0, void 0, function () {
            var member, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getMember(i)];
                    case 1:
                        member = _b.sent();
                        _a = { member: member };
                        return [4 /*yield*/, this.balanceOf(member)];
                    case 2: return [2 /*return*/, (_a.balance = _b.sent(), _a)];
                }
            });
        }); }); };
        _this.getGratitudesOf = function (member) {
            return _this.generateConstantIteration(function () { return _this.getGratitudesSizeOf(member); }, function (i) { return _this.getGratitudeOf(member, i); });
        };
        _this.getPollResults = function () {
            return _this.generateConstantIteration(function () { return _this.getPollResultsSize(); }, function (i) { return _this.getPollResult(i); });
        };
        // Actions
        _this.close = function () { return _this.generateAction('close')(); };
        _this.reward = function (to, kudos, message) { return _this.generateAction('reward')(to, kudos, message); };
        return _this;
    }
    KudosPollService.prototype.initAt = function (address) {
        var _this = this;
        this.web3Service
            .status$
            .filter(function (status) { return status === web3_service_1.ConnectionStatus.Total; })
            .first()
            .subscribe(function () {
            _this.web3Contract = _this.getWeb3Contract(KudosPollDefinition.abi, address);
            var kudosPoll = _this.getContract(KudosPollDefinition);
            kudosPoll.at(address)
                .then(function (contract) {
                _this.contract = contract;
                _this.initialized = true;
            });
        });
    };
    KudosPollService.prototype.remainingKudos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.balanceOf;
                        return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    KudosPollService.prototype.myKudos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getKudosOf;
                        return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    KudosPollService.prototype.myGratitudes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getGratitudesOf;
                        return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    KudosPollService.prototype.allGratitudes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var members, gratidudesByMember, allGratitudes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMembers()];
                    case 1:
                        members = _a.sent();
                        gratidudesByMember = (members || [])
                            .map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getGratitudesOf(member)];
                                    case 1: return [2 /*return*/, (_a.sent())
                                            .map(function (gratitude) { return (__assign({}, gratitude, { to: member })); })];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(gratidudesByMember)];
                    case 2:
                        allGratitudes = (_a.sent())
                            .reduce(function (acc, _) { return acc.concat(_); }, []);
                        return [2 /*return*/, allGratitudes];
                }
            });
        });
    };
    KudosPollService.prototype.gratitudesNumberByMember = function () {
        return __awaiter(this, void 0, void 0, function () {
            var members, initial, allGratitudes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMembers()];
                    case 1:
                        members = _a.sent();
                        initial = (members || []).reduce(function (acc, _) {
                            var _a;
                            return (__assign({}, acc, (_a = {}, _a[_] = 0, _a)));
                        }, {});
                        return [4 /*yield*/, this.allGratitudes()];
                    case 2:
                        allGratitudes = (_a.sent())
                            .reduce(function (_a, _b) {
                            var received = _a.received, sent = _a.sent;
                            var from = _b.from, to = _b.to;
                            var _c, _d;
                            return ({
                                received: __assign({}, received, (_c = {}, _c[to.toLowerCase()] = (received[to.toLowerCase()] || 0) + 1, _c)),
                                sent: __assign({}, sent, (_d = {}, _d[from.toLowerCase()] = (sent[from.toLowerCase()] || 0) + 1, _d)),
                            });
                        }, { received: __assign({}, initial), sent: __assign({}, initial) });
                        return [2 /*return*/, allGratitudes];
                }
            });
        });
    };
    KudosPollService.prototype.myGratitudesSent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1:
                        myAccount = _a.sent();
                        return [4 /*yield*/, this.allGratitudes()];
                    case 2: return [2 /*return*/, (_a.sent())
                            .filter(function (gratitude) { return gratitude.from.toLowerCase() === myAccount.toLowerCase(); })];
                }
            });
        });
    };
    KudosPollService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, store_1.Store])
    ], KudosPollService);
    return KudosPollService;
}(mixins_1.SmartContractExtender(KudosPollSmartContract, mixins_1.OwnableMixin, mixins_1.BasicTokenMixin, mixins_1.BurnableTokenMixin, mixins_1.MembershipMixin)));
exports.KudosPollService = KudosPollService;
//# sourceMappingURL=kudos-poll.service.js.map