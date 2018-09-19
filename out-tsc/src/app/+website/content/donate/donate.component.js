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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
require("rxjs/add/operator/first");
var fromRoot = require("../../../shared/store/reducers");
var shared_1 = require("../../../shared");
var content_base_abstract_1 = require("../content-base.abstract");
var DonateComponent = /** @class */ (function (_super) {
    __extends(DonateComponent, _super);
    function DonateComponent(store, web3Service, changeDetectorRef) {
        var _this = _super.call(this, changeDetectorRef) || this;
        _this.store = store;
        _this.web3Service = web3Service;
        _this.changeDetectorRef = changeDetectorRef;
        _this.donationAmount = 0.01;
        _this.pendingDonation = { working: undefined };
        _this.donationAddress = '0x178a262C6B2FFB042f5cb1A7a20d7edbDdb3B16D';
        _this.status$ = _this.store.select(fromRoot.getStatus);
        _this.network$ = _this.web3Service.getNetworkType();
        return _this;
    }
    DonateComponent.prototype.copyAddress = function () {
        var _this = this;
        this.copied = true;
        var range = document.createRange();
        range.selectNodeContents(this.addressElement.nativeElement);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        setTimeout(function () { return _this.copied = false; }, 2000);
    };
    DonateComponent.prototype.donate = function () {
        var _this = this;
        var check = function (fn) {
            fn();
            _this.changeDetectorRef.markForCheck();
        };
        this.web3Service.account$
            .first()
            .subscribe(function (userAccount) {
            _this.pendingDonation = { working: true };
            var pendingDonation = _this.pendingDonation;
            _this.web3Service
                .web3
                .eth
                .sendTransaction({
                to: _this.donationAddress,
                from: userAccount,
                value: _this.web3Service.web3.utils.toWei(String(_this.donationAmount), 'ether'),
            })
                .on('transactionHash', function (tx) { return check(function () { return pendingDonation.tx = tx; }); })
                .on('receipt', function () { return check(function () { return pendingDonation.working = undefined; }); })
                .on('confirmation', function (n) { return check(function () { return pendingDonation.confirmations = n; }); })
                .on('error', function (data) { return check(function () { return pendingDonation.working = undefined; }); });
        });
    };
    DonateComponent.prototype.goToEtherscan = function (tx) {
        this.web3Service.goToEtherscan(tx);
    };
    __decorate([
        core_1.ViewChild('address'),
        __metadata("design:type", core_1.ElementRef)
    ], DonateComponent.prototype, "addressElement", void 0);
    DonateComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-donate',
            templateUrl: './donate.component.html',
            styleUrls: ['./donate.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [store_1.Store, shared_1.Web3Service, core_1.ChangeDetectorRef])
    ], DonateComponent);
    return DonateComponent;
}(content_base_abstract_1.ContentBaseComponent));
exports.DonateComponent = DonateComponent;
//# sourceMappingURL=donate.component.js.map