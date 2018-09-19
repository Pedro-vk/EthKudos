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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var router_1 = require("@angular/router");
var animations_1 = require("@angular/animations");
var store_1 = require("@ngrx/store");
var Web3Module = require("web3");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/of");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/startWith");
var fromRoot = require("../../shared/store/reducers");
var kudosTokenActions = require("../../shared/store/kudos-token/kudos-token.actions");
var shared_1 = require("../../shared");
var LandingComponent = /** @class */ (function () {
    function LandingComponent(store, web3Service, kudosOrganisationsService, kudosTokenFactoryService, router, activatedRoute, changeDetectorRef, http) {
        var _this = this;
        this.store = store;
        this.web3Service = web3Service;
        this.kudosOrganisationsService = kudosOrganisationsService;
        this.kudosTokenFactoryService = kudosTokenFactoryService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.changeDetectorRef = changeDetectorRef;
        this.http = http;
        this.newOrg = {};
        this.newKudosTokenAddress = new Subject_1.Subject();
        this.newOrgAddress = new Subject_1.Subject();
        this.nodes = [
            { data: { id: 'a', v: 1, h: 0, name: 'Ifan Colon', address: 'RANDOM #####Ifan Colon#####' } },
            { data: { id: 'b', v: 0, h: 1, name: 'Phoenix Mclean', address: 'RANDOM #####Phoenix Mclean##### 1' } },
            { data: { id: 'c', v: 0, h: 1, name: 'Carlie Lim', address: 'RANDOM #####Carlie Lim##### 1' } },
            { data: { id: 'd', v: -1, h: 0, name: 'Luci Haynes', address: 'RANDOM #####Luci Haynes##### @892' } },
            { data: { id: 'e', v: -1, h: 0, name: 'Jaya Lovell', address: 'RANDOM #####Jaya Lovell#####' } },
            { data: { id: 'f', v: 0, h: -1, name: 'Larry Pineda', address: 'RANDOM #####Larry Pineda#####' } },
            { data: { id: 'g', v: 0, h: -1, name: 'Robbie Shepherd', address: 'RANDOM #####Robbie Shepherd##### 2' } },
        ];
        this.edgesList = [
            ['b', 'a', 1, 'Thanks for setting up my PC'], ['c', 'a', 0.5, 'I love the new laptops!'],
            ['f', 'g', 0.2, 'Thanks for watering my cactus :)'], ['c', 'd', 1, 'You are an amazing coworker'],
            ['e', 'a', 2, 'The server is working again! Thanks!'], ['f', 'a', 1.5, 'Thanks for rescue the data!'],
            ['g', 'a', 0.2, 'Thanks for install the printer'], ['a', 'b', 0.5, 'I love the new plants!'],
            ['g', 'c', 0.8, 'I love the new branding'], ['f', 'c', 1.2, 'Thanks to sending me the new branding'],
            ['c', 'b', 1, 'Thanks for buying the bamboo tables'], ['d', 'c', 1, 'I appreciate your dedication'],
            ['d', 'e', 0.5, 'Thanks for your help'], ['e', 'f', 0.1, 'Thanks for the coffee ;)'],
        ];
        this.hasChild = !!this.activatedRoute.firstChild;
        this.hasError$ = this.activatedRoute.params
            .map(function (_a) {
            var errorMessage = _a.errorMessage;
            return errorMessage;
        })
            .filter(function (_) { return !!_; })
            .shareReplay();
        this.ranking = [
            { balance: 21.75, name: 'Ifan Colon', member: 'RANDOM #####Ifan Colon#####' },
            { balance: 18.8, name: 'Phoenix Mclean', member: 'RANDOM #####Phoenix Mclean##### 1' },
            { balance: 16, name: 'Carlie Lim', member: 'RANDOM #####Carlie Lim##### 1' },
            { balance: 13.2, name: 'Luci Haynes', member: 'RANDOM #####Luci Haynes##### @892' },
            { balance: 12.25, name: 'Jaya Lovell', member: 'RANDOM #####Jaya Lovell#####' },
            { balance: 10, name: 'Larry Pineda', member: 'RANDOM #####Larry Pineda#####' },
            { balance: 6, name: 'Robbie Shepherd', member: 'RANDOM #####Robbie Shepherd##### 2' },
        ];
        this.status$ = this.store.select(fromRoot.getStatus);
        this.organisations$ = this.kudosOrganisationsService.checkUpdates(function (_) { return _.getOrganisations(); })
            .combineLatest(this.newOrgAddress.startWith(undefined))
            .map(function (_a) {
            var organisations = _a[0], search = _a[1];
            return !search ? [] :
                organisations
                    .filter(function (_) { return _.indexOf(search) === 0; });
        });
        this.selectedOrganisation$ = this.newOrgAddress
            .mergeMap(function (address) {
            if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
                return Observable_1.Observable.of(undefined);
            }
            return _this.getKudosTokenInfo(address);
        })
            .shareReplay();
        this.newOrganisation$ = this.newKudosTokenAddress
            .mergeMap(function (address) { return _this.getKudosTokenInfo(address); })
            .distinctUntilChanged();
        this.previousOrganisation$ = Observable_1.Observable.of(localStorage ? localStorage.getItem('kudos-address') : undefined)
            .filter(function (_) { return !!_; })
            .mergeMap(function (address) { return _this.getKudosTokenInfo(address); })
            .distinctUntilChanged();
    }
    LandingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.select(fromRoot.getStatus)
            .subscribe(function (status) {
            if (status === shared_1.ConnectionStatus.Total && _this.router.url.match(/^\/error/)) {
                _this.router.navigate(['/']);
            }
        });
        // Getting donation account balance
        this.donationGoal = 0.2;
        this.getBalance('0x178a262C6B2FFB042f5cb1A7a20d7edbDdb3B16D', 'G5GY5DRYQNX4SFJKNPQHHF3864VNKT29H3')
            .subscribe(function (balance) { return _this.donationBalance = balance; });
    };
    LandingComponent.prototype.getDecimals = function (n) {
        if (n === void 0) { n = 0; }
        return n ? 1 / (Math.pow(2, n)) : 0;
    };
    LandingComponent.prototype.trackMember = function (index, _a) {
        var member = _a.member;
        return member || undefined;
    };
    LandingComponent.prototype.getBalance = function (account, apiKey) {
        var _this = this;
        return Observable_1.Observable.interval(30 * 1000)
            .startWith(undefined)
            .mergeMap(function () {
            return _this.http
                .get("https://api.etherscan.io/api?module=account&action=balance&address=" + account + "&tag=latest&apikey=" + apiKey);
        })
            .map(function (_a) {
            var result = _a.result;
            return +Web3Module.utils.fromWei(result, 'ether');
        });
    };
    LandingComponent.prototype.getDonationProgress = function () {
        var dashoffset = 1099.56;
        if (!this.donationBalance) {
            return dashoffset;
        }
        return Math.min(dashoffset * (0.75 * (1 - Math.min(this.donationBalance / this.donationGoal, 1)) + 0.25), dashoffset * 0.98);
    };
    LandingComponent.prototype.createOrganisation = function (form) {
        var _this = this;
        var done = function (success) { return _this.onActionFinished(success, _this.newOrg, function (_) { return _this.newOrg = _; }, form); };
        this.newOrg.working = true;
        this.kudosOrganisationsService
            .newOrganisation(this.newOrg.organisationName, this.newOrg.name, this.newOrg.symbol, this.newOrg.decimals || 0, this.newOrg.toDirectory || false)
            .then(function (tx) {
            var newKudosTokenAddress = tx.events.NewOrganisation.returnValues.kudosToken;
            _this.newKudosTokenAddress.next(newKudosTokenAddress);
            done(true);
        })
            .catch(function (err) { return console.warn(err) || done(); });
    };
    LandingComponent.prototype.onActionFinished = function (success, obj, setter, form) {
        if (success) {
            if (form) {
                setter({});
                form.reset();
                form.resetForm();
            }
        }
        else {
            setter(__assign({}, obj, { working: undefined }));
        }
        this.changeDetectorRef.markForCheck();
    };
    LandingComponent.prototype.getKudosTokenInfo = function (address) {
        this.store.dispatch(new kudosTokenActions.LoadBasicDataAction(address));
        return this.store.select(fromRoot.getKudosTokenByAddressWithAccountData(address));
    };
    LandingComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-landing',
            templateUrl: './landing.component.html',
            styleUrls: ['./landing.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            animations: [
                shared_1.cardInOutAnimation,
                animations_1.trigger('warning', [
                    animations_1.transition(':enter', [
                        animations_1.style({ height: 0, padding: 0 }),
                        animations_1.animate('.3s ease', animations_1.style({ height: '*', padding: '*' })),
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.style({ height: '*', padding: '*' }),
                        animations_1.animate('.3s ease', animations_1.style({ height: 0, padding: 0 })),
                    ]),
                ]),
            ]
        }),
        __metadata("design:paramtypes", [store_1.Store,
            shared_1.Web3Service,
            shared_1.KudosOrganisationsService,
            shared_1.KudosTokenFactoryService,
            router_1.Router,
            router_1.ActivatedRoute,
            core_1.ChangeDetectorRef,
            http_1.HttpClient])
    ], LandingComponent);
    return LandingComponent;
}());
exports.LandingComponent = LandingComponent;
//# sourceMappingURL=landing.component.js.map