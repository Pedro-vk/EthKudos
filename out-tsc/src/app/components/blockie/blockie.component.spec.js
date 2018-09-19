"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var animations_1 = require("@angular/platform-browser/animations");
var store_1 = require("@ngrx/store");
var app_common_module_1 = require("../../app-common.module");
var shared_1 = require("../../shared");
var store_2 = require("../../shared/store");
var blockie_component_1 = require("./blockie.component");
describe('BlockieComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppMaterialModule,
                testing_2.RouterTestingModule,
                animations_1.NoopAnimationsModule,
                store_1.StoreModule.forRoot(store_2.reducers),
            ],
            declarations: [
                blockie_component_1.BlockieComponent,
            ],
            providers: shared_1.PROVIDERS.slice(),
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(blockie_component_1.BlockieComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=blockie.component.spec.js.map