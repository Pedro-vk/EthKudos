"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var http_1 = require("@angular/common/http");
var animations_1 = require("@angular/platform-browser/animations");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var router_store_1 = require("@ngrx/router-store");
var app_common_module_1 = require("../app-common.module");
var shared_1 = require("../shared");
var store_2 = require("../shared/store");
var app_component_1 = require("./app.component");
describe('AppComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                testing_2.RouterTestingModule,
                http_1.HttpClientModule,
                animations_1.NoopAnimationsModule,
                store_1.StoreModule.forRoot(store_2.reducers),
                effects_1.EffectsModule.forRoot(store_2.effects),
                router_store_1.StoreRouterConnectingModule,
            ],
            declarations: [
                app_component_1.AppComponent,
            ],
            providers: shared_1.PROVIDERS.slice(),
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=app.component.spec.js.map