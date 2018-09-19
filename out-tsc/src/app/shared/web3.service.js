"use strict";
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Web3Module = require("web3");
var abiDecoder = require("abi-decoder");
var contract = require("truffle-contract");
var detect_browser_1 = require("detect-browser");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/from");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/merge");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/share");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var Migrations = require("../../../build/contracts/Migrations.json");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Total"] = "total";
    ConnectionStatus["NoAccount"] = "no-account";
    ConnectionStatus["NoProvider"] = "no-provider";
    ConnectionStatus["NoNetwork"] = "no-network";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
exports.WEB3_PROVIDER = new core_1.InjectionToken('WEB3_PROVIDER');
var Web3Service = /** @class */ (function () {
    function Web3Service(_web3Provider) {
        var _this = this;
        this._web3Provider = _web3Provider;
        this._newWatchingAddress$ = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.interval$ = Observable_1.Observable.of(undefined)
            .mergeMap(function () { return (_this._intervalMock && _this._intervalMock()) || Observable_1.Observable.interval(100); })
            .share()
            .startWith(undefined);
        this.newBlock$ = this.interval$
            .mergeMap(function () { return _this.getBlockNumber(); })
            .distinctUntilChanged()
            .scan(function (prev, block) { return [prev[1], block]; }, [])
            .mergeMap(function (_a) {
            var prev = _a[0], block = _a[1];
            if (!prev) {
                return Observable_1.Observable.of(block);
            }
            return Observable_1.Observable.from(new Array(block - prev).fill(0).map(function (_, i) { return prev + 1 + i; }));
        })
            .share();
        this.account$ = this.interval$
            .mergeMap(function () { return _this.getAccount(); })
            .distinctUntilChanged()
            .shareReplay();
        this.changes$ = Observable_1.Observable
            .merge(this.newBlock$, this.account$)
            .map(function () { return undefined; })
            .share();
        this.ethBalance$ = this.changes$
            .mergeMap(function () { return _this.getEthBalance(); })
            .distinctUntilChanged()
            .shareReplay();
        this.status$ = this.interval$
            .mergeMap(function () { return _this.getAccount(); })
            .filter(function () { return _this.existInNetwork !== undefined; })
            .map(function (account) {
            if (!_this.web3) {
                return ConnectionStatus.NoProvider;
            }
            if (!account) {
                return ConnectionStatus.NoAccount;
            }
            if (!_this.existInNetwork) {
                return ConnectionStatus.NoNetwork;
            }
            return ConnectionStatus.Total;
        })
            .distinctUntilChanged()
            .shareReplay(1);
        this.watchingContractChanges$ = this._newWatchingAddress$
            .scan(function (acc, address) { return acc.concat([String(address).toLowerCase()]).filter(function (_, i, list) { return list.indexOf(_) === i; }); }, [])
            .filter(function (addrs) { return !!addrs.length; })
            .mergeMap(function (addrs) {
            return _this.newBlock$
                .mergeMap(function (blockNumber) { return _this.getBlock(blockNumber, true); })
                .filter(function (_) { return !!_; })
                .map(function (_a) {
                var transactions = _a.transactions;
                return transactions.map(function (transaction) { return String(transaction.to).toLowerCase(); });
            })
                .mergeMap(function (changes) { return Observable_1.Observable.from(changes.filter(function (change) { return addrs.indexOf(change) !== -1; })); });
        })
            .share();
        this.checkContractInNetwork();
        this.listenChanges();
    }
    Object.defineProperty(Web3Service.prototype, "web3", {
        get: function () {
            return this._web3 || this.initWeb3();
        },
        enumerable: true,
        configurable: true
    });
    Web3Service.addABI = function (abi) {
        abiDecoder.addABI(abi);
    };
    Web3Service.prototype.listenChanges = function () {
        var _this = this;
        if (!this._intervalMock) {
            this.status$.subscribe(function (status) { return _this.status = status; });
            this.account$.subscribe(function (account) { return _this.account = account; });
            this.getNetworkType().subscribe(function (type) { return _this.networkType = type; });
        }
    };
    Web3Service.prototype.initWeb3 = function () {
        if (this._web3Provider) {
            return this._web3 = new Web3Module(this._web3Provider);
        }
    };
    Web3Service.prototype.checkContractInNetwork = function () {
        var _this = this;
        if (this.web3) {
            var migrations = contract(Migrations);
            migrations.setProvider(this.web3.currentProvider);
            migrations
                .deployed()
                .then(function () { return _this.existInNetwork = true; })
                .catch(function () { return _this.existInNetwork = false; });
        }
        else {
            this.existInNetwork = false;
        }
    };
    Web3Service.prototype.getAccount = function () {
        if (this.web3 && this.web3.eth) {
            return Observable_1.Observable
                .fromPromise(this.web3.eth.getAccounts())
                .map(function (accounts) { return accounts[0] || undefined; });
        }
        return Observable_1.Observable.of(undefined);
    };
    Web3Service.prototype.getEthBalance = function () {
        var _this = this;
        if (!this.web3) {
            return Observable_1.Observable.of(undefined);
        }
        return this.getAccount()
            .mergeMap(function (account) { return Observable_1.Observable.fromPromise(_this.web3.eth.getBalance(account)); })
            .map(function (balance) { return +_this.web3.utils.fromWei(balance, 'ether'); })
            .catch(function () { return Observable_1.Observable.of(undefined); });
    };
    Web3Service.prototype.getBlockNumber = function () {
        if (this.web3) {
            return Observable_1.Observable.fromPromise(this.web3.eth.getBlockNumber());
        }
        return Observable_1.Observable.empty();
    };
    Web3Service.prototype.checkUpdates = function (checkObservable) {
        var _this = this;
        return this.changes$
            .mergeMap(function () { return checkObservable(_this); })
            .distinctUntilChanged();
    };
    Web3Service.prototype.getNetworkId = function () {
        if (!this.web3) {
            return Observable_1.Observable.empty();
        }
        return Observable_1.Observable.fromPromise(this.web3.eth.net.getId())
            .map(function (_) { return (+_) || undefined; });
    };
    Web3Service.prototype.getNetworkType = function () {
        return this.getNetworkId()
            .map(function (id) {
            switch (id) {
                case 1: return 'main';
                case 2: return 'morden';
                case 3: return 'ropsten';
                case 4: return 'rinkeby';
                case 42: return 'kovan';
                default: return 'unknown';
            }
        });
    };
    Web3Service.prototype.watchContractChanges = function (address) {
        this._newWatchingAddress$.next(address);
        return this.watchingContractChanges$.filter(function (_) { return _ === address; }).share();
    };
    Web3Service.prototype.getTransaction = function (tx) {
        return Observable_1.Observable.fromPromise(this.web3.eth.getTransaction(tx));
    };
    Web3Service.prototype.getTransactionMetadata = function (transaction) {
        if (!transaction) {
            return;
        }
        var _a = abiDecoder.decodeMethod(transaction.input) || { name: '', params: [] }, name = _a.name, params = _a.params;
        return __assign({}, transaction, { method: name, methodName: name.replace(/([A-Z])/g, ' $1').toLowerCase(), params: params });
    };
    Web3Service.prototype.getBlock = function (number, returnTransactions) {
        if (returnTransactions === void 0) { returnTransactions = false; }
        return Observable_1.Observable.fromPromise(this.web3.eth.getBlock(number, returnTransactions));
    };
    Web3Service.prototype.getMetamaskInstallationLink = function (browser) {
        switch (browser || detect_browser_1.detect().name) {
            case 'chrome': return 'https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn';
            case 'firefox': return 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
            case 'opera': return 'https://addons.opera.com/en/extensions/details/metamask/';
            default: return 'https://metamask.io/';
        }
    };
    Web3Service.prototype.goToEtherscan = function (tx) {
        var network = this.networkType;
        var url;
        switch (network) {
            case 'main':
                url = "https://etherscan.io/tx/" + tx;
                break;
            case 'ropsten':
            case 'rinkeby':
            case 'kovan':
                url = "https://" + network + ".etherscan.io/tx/" + tx;
                break;
            default: break;
        }
        if (url) {
            var etherscan = window.open(url, '_blank');
            etherscan.focus();
        }
    };
    Web3Service = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()), __param(0, core_1.Inject(exports.WEB3_PROVIDER)),
        __metadata("design:paramtypes", [Object])
    ], Web3Service);
    return Web3Service;
}());
exports.Web3Service = Web3Service;
//# sourceMappingURL=web3.service.js.map