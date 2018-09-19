"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_wrapper_module_1 = require("./app/app-wrapper.module");
var environment_1 = require("./environments/environment");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_wrapper_module_1.AppWrapperModule)
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map