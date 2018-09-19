"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var animations_1 = require("@angular/platform-browser/animations");
var app_common_module_1 = require("../../app-common.module");
var faqs_on_app_component_1 = require("./faqs-on-app.component");
describe('FaqsOnAppComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                animations_1.NoopAnimationsModule,
            ],
            declarations: [
                faqs_on_app_component_1.FaqsOnAppComponent,
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(faqs_on_app_component_1.FaqsOnAppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=faqs-on-app.component.spec.js.map