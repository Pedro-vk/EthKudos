"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var autocomplete_1 = require("@angular/material/autocomplete");
var button_1 = require("@angular/material/button");
var button_toggle_1 = require("@angular/material/button-toggle");
var card_1 = require("@angular/material/card");
var checkbox_1 = require("@angular/material/checkbox");
var chips_1 = require("@angular/material/chips");
var dialog_1 = require("@angular/material/dialog");
var expansion_1 = require("@angular/material/expansion");
var icon_1 = require("@angular/material/icon");
var input_1 = require("@angular/material/input");
var list_1 = require("@angular/material/list");
var progress_bar_1 = require("@angular/material/progress-bar");
var select_1 = require("@angular/material/select");
var toolbar_1 = require("@angular/material/toolbar");
var tooltip_1 = require("@angular/material/tooltip");
var components_1 = require("./components");
var AppMaterialModule = /** @class */ (function () {
    function AppMaterialModule() {
    }
    AppMaterialModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                autocomplete_1.MatAutocompleteModule,
                button_1.MatButtonModule,
                button_toggle_1.MatButtonToggleModule,
                card_1.MatCardModule,
                checkbox_1.MatCheckboxModule,
                chips_1.MatChipsModule,
                dialog_1.MatDialogModule,
                expansion_1.MatExpansionModule,
                icon_1.MatIconModule,
                input_1.MatInputModule,
                list_1.MatListModule,
                progress_bar_1.MatProgressBarModule,
                select_1.MatSelectModule,
                toolbar_1.MatToolbarModule,
                tooltip_1.MatTooltipModule,
            ],
            exports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                autocomplete_1.MatAutocompleteModule,
                button_1.MatButtonModule,
                button_toggle_1.MatButtonToggleModule,
                card_1.MatCardModule,
                checkbox_1.MatCheckboxModule,
                chips_1.MatChipsModule,
                dialog_1.MatDialogModule,
                expansion_1.MatExpansionModule,
                icon_1.MatIconModule,
                input_1.MatInputModule,
                list_1.MatListModule,
                progress_bar_1.MatProgressBarModule,
                select_1.MatSelectModule,
                toolbar_1.MatToolbarModule,
                tooltip_1.MatTooltipModule,
            ],
        })
    ], AppMaterialModule);
    return AppMaterialModule;
}());
exports.AppMaterialModule = AppMaterialModule;
var AppCommonModule = /** @class */ (function () {
    function AppCommonModule() {
    }
    AppCommonModule = __decorate([
        core_1.NgModule({
            declarations: components_1.COMPONENTS.concat(components_1.ENTRY_COMPONENTS),
            imports: [
                AppMaterialModule,
                core_2.TranslateModule.forRoot(),
            ],
            exports: [
                AppMaterialModule,
                core_2.TranslateModule
            ].concat(components_1.COMPONENTS, components_1.ENTRY_COMPONENTS),
            entryComponents: components_1.ENTRY_COMPONENTS.slice(),
        })
    ], AppCommonModule);
    return AppCommonModule;
}());
exports.AppCommonModule = AppCommonModule;
//# sourceMappingURL=app-common.module.js.map