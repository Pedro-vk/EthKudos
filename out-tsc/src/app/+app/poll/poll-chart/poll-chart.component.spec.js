"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var animations_1 = require("@angular/platform-browser/animations");
var router_1 = require("@angular/router");
var store_1 = require("@ngrx/store");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var shared_1 = require("../../../shared");
var app_common_module_1 = require("../../../app-common.module");
var poll_chart_component_1 = require("./poll-chart.component");
describe('PollChartComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppCommonModule,
                testing_2.RouterTestingModule,
                animations_1.NoopAnimationsModule,
                store_1.StoreModule.forRoot({}),
            ],
            declarations: [poll_chart_component_1.PollChartComponent],
            providers: shared_1.PROVIDERS.concat([
                {
                    provide: router_1.ActivatedRoute, useValue: (function (_) {
                        _.parent = {};
                        _.params = _.parent.params = Observable_1.Observable.of({ tokenAddress: "0x" + '0'.repeat(40) });
                        return _;
                    })({}),
                }
            ]),
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(poll_chart_component_1.PollChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=poll-chart.component.spec.js.map