"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var core_1 = require("@ngx-translate/core");
var animations_1 = require("@angular/platform-browser/animations");
var app_common_module_1 = require("../../app-common.module");
var faqs_component_1 = require("./faqs.component");
describe('FaqsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppMaterialModule,
                animations_1.NoopAnimationsModule,
                core_1.TranslateModule.forRoot(),
            ],
            declarations: [faqs_component_1.FaqsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(faqs_component_1.FaqsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=faqs.component.spec.js.map