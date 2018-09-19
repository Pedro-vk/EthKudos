"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var animations_1 = require("@angular/platform-browser/animations");
var core_1 = require("@ngx-translate/core");
var material_1 = require("@angular/material");
var app_common_module_1 = require("../../app-common.module");
var share_dialog_component_1 = require("./share-dialog.component");
describe('ShareDialogComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_common_module_1.AppMaterialModule,
                animations_1.NoopAnimationsModule,
                core_1.TranslateModule.forRoot(),
            ],
            providers: [
                { provide: material_1.MAT_DIALOG_DATA, useValue: '' },
            ],
            declarations: [share_dialog_component_1.ShareDialogComponent],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(share_dialog_component_1.ShareDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=share-dialog.component.spec.js.map