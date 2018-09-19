"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var shared_1 = require("./shared");
var _app_1 = require("./+app");
var _website_1 = require("./+website");
var routes = [
    // Website
    { path: '', component: _website_1.LandingComponent, children: [
            { path: 'join/:tokenAddress', component: _website_1.JoinComponent },
        ] },
    { path: 'error/:errorMessage', component: _website_1.LandingComponent },
    // Website - content
    { path: '', component: _website_1.ContentComponent, children: [
            { path: 'faqs', component: _website_1.FaqsPageComponent },
            { path: 'privacy-policy', component: _website_1.PrivacyPolicyComponent },
            { path: 'donate', component: _website_1.DonateComponent },
            { path: 'about', component: _website_1.AboutComponent },
        ] },
    // App
    {
        path: ':tokenAddress',
        component: _app_1.AppComponent,
        canActivate: [shared_1.IsConnectedGuard, shared_1.IsTokenGuard],
        canActivateChild: [shared_1.IsConnectedGuard],
        children: [
            { path: '', component: _app_1.HomeComponent },
            { path: 'admin', component: _app_1.AdminComponent, canActivate: [shared_1.IsOwnerGuard] },
            { path: 'active', component: _app_1.PollActiveComponent },
            { path: 'closed/:address', component: _app_1.PollPreviousComponent, canActivate: [shared_1.IsPollGuard] },
            { path: 'graph/:address', component: _app_1.PollChartComponent, canActivate: [shared_1.IsPollGuard] },
            { path: 'faqs', component: _app_1.FaqsOnAppComponent },
        ],
    },
    { path: '**', redirectTo: '/' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map