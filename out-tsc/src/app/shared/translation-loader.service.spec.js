"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
require("rxjs/add/operator/first");
var translation_loader_service_1 = require("./translation-loader.service");
describe('TranslationLoaderService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [translation_loader_service_1.TranslationLoaderService]
        });
    });
    it('should be created', testing_1.inject([translation_loader_service_1.TranslationLoaderService], function (service) {
        expect(service).toBeTruthy();
    }));
    it('should return English as default translation', testing_1.inject([translation_loader_service_1.TranslationLoaderService], function (service) {
        service
            .getTranslation()
            .first()
            .subscribe(function (_a) {
            var $lang = _a.$lang;
            return expect($lang).toBe('en');
        });
    }));
    it('should return Spanish translation', testing_1.inject([translation_loader_service_1.TranslationLoaderService], function (service) {
        service
            .getTranslation('es')
            .first()
            .subscribe(function (_a) {
            var $lang = _a.$lang;
            return expect($lang).toBe('es');
        });
    }));
});
//# sourceMappingURL=translation-loader.service.spec.js.map