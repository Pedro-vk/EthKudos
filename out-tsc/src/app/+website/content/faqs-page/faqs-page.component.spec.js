"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var animations_1 = require("@angular/platform-browser/animations");
var app_common_module_1 = require("../../../app-common.module");
var faqs_page_component_1 = require("./faqs-page.component");
describe('FaqsPageComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                animations_1.NoopAnimationsModule,
            ],
            declarations: [
                faqs_page_component_1.FaqsPageComponent,
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(faqs_page_component_1.FaqsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=faqs-page.component.spec.js.map