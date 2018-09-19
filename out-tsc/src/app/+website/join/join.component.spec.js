"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var testing_2 = require("@angular/router/testing");
var animations_1 = require("@angular/platform-browser/animations");
var Observable_1 = require("rxjs/Observable");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
require("rxjs/add/observable/empty");
var app_common_module_1 = require("../../app-common.module");
var shared_1 = require("../../shared");
var store_2 = require("../../shared/store");
var join_component_1 = require("./join.component");
describe('JoinComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                testing_2.RouterTestingModule,
                animations_1.NoopAnimationsModule,
                store_1.StoreModule.forRoot(store_2.reducers),
                effects_1.EffectsModule.forRoot(store_2.effects),
            ],
            declarations: [
                join_component_1.JoinComponent,
            ],
            providers: shared_1.PROVIDERS.concat([
                {
                    provide: router_1.ActivatedRoute, useValue: (function (_) {
                        _.parent = {};
                        _.parent.params = _.params = Observable_1.Observable.empty();
                        return _;
                    })({}),
                }
            ]),
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(join_component_1.JoinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=join.component.spec.js.map