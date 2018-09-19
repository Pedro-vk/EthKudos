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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var translationEs = require("../../i18n/es.json");
var translationEn = require("../../i18n/en.json");
var TranslationLoaderService = /** @class */ (function () {
    function TranslationLoaderService() {
    }
    TranslationLoaderService.prototype.getTranslation = function (lang) {
        switch (lang) {
            case 'es': return Observable_1.Observable.of(__assign({}, translationEs, { $lang: 'es' }));
            default: return Observable_1.Observable.of(__assign({}, translationEn, { $lang: 'en' }));
        }
    };
    TranslationLoaderService = __decorate([
        core_1.Injectable()
    ], TranslationLoaderService);
    return TranslationLoaderService;
}());
exports.TranslationLoaderService = TranslationLoaderService;
//# sourceMappingURL=translation-loader.service.js.map