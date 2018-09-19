"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var animations_1 = require("@angular/platform-browser/animations");
var common_1 = require("@angular/common");
var en_GB_1 = require("@angular/common/locales/en-GB");
var es_1 = require("@angular/common/locales/es");
var core_2 = require("@ngx-translate/core");
var ngx_translate_messageformat_compiler_1 = require("ngx-translate-messageformat-compiler");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var router_store_1 = require("@ngrx/router-store");
var store_devtools_1 = require("@ngrx/store-devtools");
var app_routing_module_1 = require("./app-routing.module");
var app_common_module_1 = require("./app-common.module");
var app_wrapper_component_1 = require("./app-wrapper.component");
var environment_1 = require("../environments/environment");
var shared_1 = require("./shared");
var store_2 = require("./shared/store");
var app_module_1 = require("./+app/app.module");
var website_module_1 = require("./+website/website.module");
common_1.registerLocaleData(en_GB_1.default, 'en');
common_1.registerLocaleData(es_1.default, 'es');
function getCurrentValidLocale() {
    var lang = (navigator.language || navigator.userLanguage).split('-')[0];
    switch (lang) {
        case 'es':
            return lang;
    }
    return 'en';
}
exports.getCurrentValidLocale = getCurrentValidLocale;
var AppWrapperModule = /** @class */ (function () {
    function AppWrapperModule() {
    }
    AppWrapperModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_wrapper_component_1.AppWrapperComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                app_routing_module_1.AppRoutingModule,
                core_2.TranslateModule.forRoot({
                    loader: {
                        provide: core_2.TranslateLoader,
                        useClass: shared_1.TranslationLoaderService,
                    },
                    compiler: {
                        provide: core_2.TranslateCompiler,
                        useClass: ngx_translate_messageformat_compiler_1.TranslateMessageFormatCompiler,
                    },
                }),
                store_1.StoreModule.forRoot(store_2.reducers),
                effects_1.EffectsModule.forRoot(store_2.effects),
                router_store_1.StoreRouterConnectingModule,
                store_devtools_1.StoreDevtoolsModule.instrument(),
                app_common_module_1.AppCommonModule,
                app_module_1.AppModule,
                website_module_1.WebsiteModule,
            ],
            providers: shared_1.PROVIDERS.concat([
                platform_browser_1.Title,
                { provide: core_1.LOCALE_ID, useValue: getCurrentValidLocale() },
                { provide: shared_1.WEB3_PROVIDER, useValue: environment_1.environment.web3Provider || (window.web3 && window.web3.currentProvider) }
            ]),
            bootstrap: [app_wrapper_component_1.AppWrapperComponent]
        })
    ], AppWrapperModule);
    return AppWrapperModule;
}());
exports.AppWrapperModule = AppWrapperModule;
//# sourceMappingURL=app-wrapper.module.js.map