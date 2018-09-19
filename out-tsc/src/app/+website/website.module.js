"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_common_module_1 = require("../app-common.module");
var app_routing_module_1 = require("../app-routing.module");
var shared_1 = require("../shared");
var landing_1 = require("./landing");
var join_1 = require("./join");
var content_1 = require("./content");
var WebsiteModule = /** @class */ (function () {
    function WebsiteModule() {
    }
    WebsiteModule = __decorate([
        core_1.NgModule({
            declarations: [
                join_1.JoinComponent,
                landing_1.LandingComponent
            ].concat(content_1.CONTENT_COMPONENTS),
            imports: [
                app_common_module_1.AppCommonModule,
                app_routing_module_1.AppRoutingModule,
            ],
            providers: shared_1.PROVIDERS.slice(),
        })
    ], WebsiteModule);
    return WebsiteModule;
}());
exports.WebsiteModule = WebsiteModule;
//# sourceMappingURL=website.module.js.map