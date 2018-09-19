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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var animations_1 = require("@angular/platform-browser/animations");
var store_1 = require("@ngrx/store");
var effects_1 = require("@ngrx/effects");
var core_1 = require("@ngx-translate/core");
var app_common_module_1 = require("../../app-common.module");
var shared_1 = require("../../shared");
var store_2 = require("../../shared/store");
var help_cards_component_1 = require("./help-cards.component");
describe('HelpCardsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppMaterialModule,
                animations_1.NoopAnimationsModule,
                core_1.TranslateModule.forRoot(),
                store_1.StoreModule.forRoot(__assign({}, store_2.reducers)),
                effects_1.EffectsModule.forRoot(store_2.effects),
            ],
            providers: shared_1.PROVIDERS.slice(),
            declarations: [
                help_cards_component_1.HelpCardsComponent,
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(help_cards_component_1.HelpCardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=help-cards.component.spec.js.map