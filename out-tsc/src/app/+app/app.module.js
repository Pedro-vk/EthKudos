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
var app_component_1 = require("./app.component");
var admin_1 = require("./admin");
var home_1 = require("./home");
var poll_1 = require("./poll");
var faqs_on_app_1 = require("./faqs-on-app");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                admin_1.AdminComponent,
                app_component_1.AppComponent,
                faqs_on_app_1.FaqsOnAppComponent,
                home_1.HomeComponent,
                poll_1.PollActiveComponent,
                poll_1.PollChartComponent,
                poll_1.PollPreviousComponent,
            ],
            imports: [
                app_common_module_1.AppCommonModule,
                app_routing_module_1.AppRoutingModule,
            ],
            providers: shared_1.PROVIDERS.slice(),
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map