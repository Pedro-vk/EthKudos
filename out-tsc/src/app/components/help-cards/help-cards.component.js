"use strict";
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
var MetamaskLogo = require("metamask-logo");
var fromRoot = require("../../shared/store/reducers");
var shared_1 = require("../../shared");
var HelpCardsComponent = /** @class */ (function () {
    function HelpCardsComponent(store, web3Service) {
        this.store = store;
        this.web3Service = web3Service;
        this.metamaskInstallationLink = this.web3Service.getMetamaskInstallationLink();
        this.status$ = this.store.select(fromRoot.getStatus);
    }
    HelpCardsComponent.prototype.ngAfterViewChecked = function () {
        if (this.metamaskLogo && this.metamaskLogo.nativeElement.offsetParent) {
            if (!this.metamaskLogoViewer) {
                this.metamaskLogoViewer = MetamaskLogo({
                    pxNotRatio: true,
                    width: 80,
                    height: 80,
                    followMouse: true,
                    slowDrift: false,
                });
            }
            this.metamaskLogo.nativeElement.appendChild(this.metamaskLogoViewer.container);
        }
    };
    HelpCardsComponent.prototype.reload = function () {
        window.location.reload();
    };
    __decorate([
        core_1.ViewChild('metamaskLogo'),
        __metadata("design:type", core_1.ElementRef)
    ], HelpCardsComponent.prototype, "metamaskLogo", void 0);
    HelpCardsComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-help-cards',
            templateUrl: './help-cards.component.html',
            styleUrls: ['./help-cards.component.scss'],
            animations: [shared_1.cardInOutAnimation],
        }),
        __metadata("design:paramtypes", [store_1.Store, shared_1.Web3Service])
    ], HelpCardsComponent);
    return HelpCardsComponent;
}());
exports.HelpCardsComponent = HelpCardsComponent;
//# sourceMappingURL=help-cards.component.js.map