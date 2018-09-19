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
var store_1 = require("@ngrx/store");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/toPromise");
var KudosTokenDefinition = require("../../../../build/contracts/KudosToken.json");
var smart_contract_abstract_1 = require("./smart-contract.abstract");
var web3_service_1 = require("../web3.service");
var mixins_1 = require("./mixins");
var kudos_poll_factory_service_1 = require("../kudos-poll-factory.service");
web3_service_1.Web3Service.addABI(KudosTokenDefinition.abi);
var KudosTokenSmartContract = /** @class */ (function (_super) {
    __extends(KudosTokenSmartContract, _super);
    function KudosTokenSmartContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KudosTokenSmartContract;
}(smart_contract_abstract_1.SmartContract));
var KudosTokenService = /** @class */ (function (_super) {
    __extends(KudosTokenService, _super);
    function KudosTokenService(web3Service, store, kudosPollFactoryService) {
        var _this = _super.call(this, web3Service, store) || this;
        _this.web3Service = web3Service;
        _this.store = store;
        _this.kudosPollFactoryService = kudosPollFactoryService;
        _this._onIsValid = new Subject_1.Subject();
        _this.onIsValid = _this._onIsValid.shareReplay();
        // Events
        _this.NewPoll$ = _this.generateEventObservable('NewPoll');
        _this.ClosePoll$ = _this.generateEventObservable('ClosePoll');
        // Constants
        _this.version = function () { return _this.generateConstant('version')(); };
        _this.organisationName = function () { return _this.generateConstant('organisationName')(); };
        _this.isActivePoll = function () { return _this.generateConstant('isActivePoll')(); };
        _this.activePoll = function () { return _this.generateConstant('activePoll')(); };
        _this.getPolls = function () { return _this.generateConstant('getPolls')(); };
        _this.getPollsSize = function () { return _this.generateConstant('getPollsSize')(); };
        _this.getContact = function (address) { return _this.generateConstant('getContact')(address); };
        // Constant iterators
        _this.getBalances = function () { return _this.generateConstantIteration(function () { return _this.membersNumber(); }, function (i) { return __awaiter(_this, void 0, void 0, function () {
            var member, name, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getMember(i)];
                    case 1:
                        member = _b.sent();
                        return [4 /*yield*/, this.getContact(member)];
                    case 2:
                        name = _b.sent();
                        _a = { member: member, name: name };
                        return [4 /*yield*/, this.balanceOf(member)];
                    case 3: return [2 /*return*/, (_a.balance = _b.sent(), _a)];
                }
            });
        }); }); };
        // Actions
        _this.newPoll = function (kudosByMember, maxKudosToMember, minDurationInMinutes) {
            return _this.generateAction('newPoll')(kudosByMember, maxKudosToMember, minDurationInMinutes);
        };
        _this.closePoll = function () { return _this.generateAction('closePoll')(); };
        _this.editContact = function (address, name) { return _this.generateAction('editContact')(address, name); };
        return _this;
    }
    KudosTokenService.prototype.initAt = function (address) {
        var _this = this;
        this.web3Service
            .status$
            .filter(function (status) { return status === web3_service_1.ConnectionStatus.Total; })
            .first()
            .subscribe(function () {
            if (!_this.web3Service.web3.utils.isAddress(address)) {
                _this._onIsValid.next(_this.isValid = false);
                return;
            }
            _this.web3Contract = _this.getWeb3Contract(KudosTokenDefinition.abi, address);
            var kudosToken = _this.getContract(KudosTokenDefinition);
            kudosToken.at(address)
                .then(function (contract) {
                _this.contract = contract;
                _this.initialized = true;
            })
                .catch(function () { return _this._onIsValid.next(_this.isValid = false); });
            _this.checkIsValid()
                .then(function (_) { return _this._onIsValid.next(_this.isValid = _); })
                .catch(function () { return _this._onIsValid.next(_this.isValid = false); });
            setTimeout(function () { return _this._onIsValid.next(_this.isValid = _this.isValid || false); }, 20 * 1000);
        });
    };
    KudosTokenService.prototype.getContactsOf = function (members) {
        return __awaiter(this, void 0, void 0, function () {
            var contacts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contacts = members.map(function (member) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = { member: member };
                                    return [4 /*yield*/, this.getContact(member)];
                                case 1: return [2 /*return*/, (_a.name = _b.sent(), _a)];
                            }
                        }); }); });
                        return [4 /*yield*/, Promise.all(contacts)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KudosTokenService.prototype.getContacts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var members, contacts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMembers()];
                    case 1:
                        members = _a.sent();
                        contacts = members.map(function (member) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = { member: member };
                                    return [4 /*yield*/, this.getContact(member)];
                                case 1: return [2 /*return*/, (_a.name = _b.sent(), _a)];
                            }
                        }); }); });
                        return [4 /*yield*/, Promise.all(contacts)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KudosTokenService.prototype.myContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.web3Service.getAccount().toPromise()];
                    case 1:
                        myAccount = _a.sent();
                        return [4 /*yield*/, this.getContact(myAccount)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KudosTokenService.prototype.getPollContractByAddress = function (address) {
        return this.kudosPollFactoryService.getKudosPollServiceAt(address);
    };
    KudosTokenService.prototype.getPollContract = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var polls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPolls()];
                    case 1:
                        polls = _a.sent();
                        return [2 /*return*/, this.getPollContractByAddress(polls[index])];
                }
            });
        });
    };
    KudosTokenService.prototype.getPollsContracts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var polls;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPolls()];
                    case 1:
                        polls = _a.sent();
                        return [2 /*return*/, polls.map(function (address) { return _this.getPollContractByAddress(address); })];
                }
            });
        });
    };
    KudosTokenService.prototype.getActivePollContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activePoll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.activePoll()];
                    case 1:
                        activePoll = _a.sent();
                        return [2 /*return*/, activePoll ? this.getPollContractByAddress(activePoll) : undefined];
                }
            });
        });
    };
    KudosTokenService.prototype.getPreviousPollsContracts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var polls;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPolls()];
                    case 1:
                        polls = (_a.sent()) || [];
                        return [4 /*yield*/, this.isActivePoll()];
                    case 2:
                        if (_a.sent()) {
                            polls.pop();
                        }
                        return [2 /*return*/, polls.map(function (address) { return _this.getPollContractByAddress(address); })];
                }
            });
        });
    };
    KudosTokenService.prototype.getPreviousPolls = function () {
        return __awaiter(this, void 0, void 0, function () {
            var polls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPolls()];
                    case 1:
                        polls = _a.sent();
                        return [4 /*yield*/, this.isActivePoll()];
                    case 2:
                        if (_a.sent()) {
                            polls.pop();
                        }
                        return [2 /*return*/, polls];
                }
            });
        });
    };
    KudosTokenService.prototype.checkIsValid = function () {
        var _this = this;
        return this.onInitialized
            .map(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = false;
                        switch (_a) {
                            case this.initialized: return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.version()];
                    case 1:
                        switch (_a) {
                            case !!(_c.sent()).match(/^\d+\.\d+$/): return [3 /*break*/, 3];
                        }
                        _b = isNaN;
                        return [4 /*yield*/, this.getPollsSize()];
                    case 2:
                        switch (_a) {
                            case !_b.apply(void 0, [_c.sent()]): return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, false];
                    case 4: return [2 /*return*/, true];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        }); })
            .mergeMap(function (_) { return Observable_1.Observable.fromPromise(_); })
            .first()
            .toPromise();
    };
    KudosTokenService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web3_service_1.Web3Service, store_1.Store, kudos_poll_factory_service_1.KudosPollFactoryService])
    ], KudosTokenService);
    return KudosTokenService;
}(mixins_1.SmartContractExtender(KudosTokenSmartContract, mixins_1.OwnableMixin, mixins_1.BasicTokenMixin, mixins_1.MembershipMixin)));
exports.KudosTokenService = KudosTokenService;
//# sourceMappingURL=kudos-token.service.js.map