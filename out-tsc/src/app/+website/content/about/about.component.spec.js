"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var animations_1 = require("@angular/platform-browser/animations");
var app_common_module_1 = require("../../../app-common.module");
var shared_1 = require("../../../shared");
var about_component_1 = require("./about.component");
describe('AboutComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                animations_1.NoopAnimationsModule,
            ],
            providers: shared_1.PROVIDERS.slice(),
            declarations: [about_component_1.AboutComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(about_component_1.AboutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=about.component.spec.js.map