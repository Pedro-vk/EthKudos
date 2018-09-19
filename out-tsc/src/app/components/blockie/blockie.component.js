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
var platform_browser_1 = require("@angular/platform-browser");
var store_1 = require("@ngrx/store");
var blockies = require("blockies");
require("rxjs/add/operator/map");
require("rxjs/add/operator/shareReplay");
var fromRoot = require("../../shared/store/reducers");
var BlockieComponent = /** @class */ (function () {
    function BlockieComponent(store, domSanitizer, changeDetectorRef) {
        var _this = this;
        this.store = store;
        this.domSanitizer = domSanitizer;
        this.changeDetectorRef = changeDetectorRef;
        this.isActiveAccount$ = this.store.select(fromRoot.getAccount)
            .map(function (account) {
            if (account === void 0) { account = ''; }
            return (_this.address || '').toLowerCase() === account.toLowerCase();
        })
            .shareReplay(1);
    }
    BlockieComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.random !== undefined) {
            var changeIt_1 = function () {
                _this.blockie = _this.getImageOf("###" + Math.random() * (Math.pow(10, 4)) + "###");
                _this.changeDetectorRef.markForCheck();
            };
            changeIt_1();
            setInterval(function () { return changeIt_1(); }, +this.random || 1000);
        }
    };
    BlockieComponent.prototype.ngOnChanges = function (changes) {
        if (changes.address) {
            this.blockie = this.getImageOf(this.address);
        }
    };
    BlockieComponent.prototype.getImageOf = function (account) {
        return this.domSanitizer.bypassSecurityTrustStyle("url(" + blockies({ seed: (account || '#').toLowerCase(), size: 8, scale: 8 }).toDataURL() + ")");
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], BlockieComponent.prototype, "address", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], BlockieComponent.prototype, "variant", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", void 0)
    ], BlockieComponent.prototype, "noicon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], BlockieComponent.prototype, "random", void 0);
    BlockieComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-blockie',
            templateUrl: './blockie.component.html',
            styleUrls: ['./blockie.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [store_1.Store, platform_browser_1.DomSanitizer, core_1.ChangeDetectorRef])
    ], BlockieComponent);
    return BlockieComponent;
}());
exports.BlockieComponent = BlockieComponent;
//# sourceMappingURL=blockie.component.js.map