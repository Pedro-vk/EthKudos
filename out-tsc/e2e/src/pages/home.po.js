"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var page_abstract_po_1 = require("./page.abstract.po");
var helpers = require("../helpers");
var LandingHomePage = /** @class */ (function (_super) {
    __extends(LandingHomePage, _super);
    function LandingHomePage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getSections = helpers.getElementAll(protractor_1.by.css('section'));
        _this.getHeaderFaqsButton = helpers.getElementByDataQa('landing-home-footer-faqs');
        _this.getSectionDonateButton = helpers.getElementByDataQa('landing-home-footer-donate');
        _this.getFooterGithubButton = helpers.getElementByDataQa('landing-home-footer-github');
        _this.getFooterFaqsButton = helpers.getElementByDataQa('landing-home-footer-faqs');
        _this.getFooterAboutButton = helpers.getElementByDataQa('landing-home-footer-about');
        _this.getFooterPrivacyButton = helpers.getElementByDataQa('landing-home-footer-privacy');
        _this.getFooterDonateButton = helpers.getElementByDataQa('landing-home-footer-donate');
        _this.getJoinCard = helpers.getElementByDataQa('landing-home-join-card', 1000);
        _this.getNewOrgCard = helpers.getElementByDataQa('landing-home-new-org-card', 1000);
        _this.getCreatedOrgCard = helpers.getElementByDataQa('landing-home-created-org-card', 1000);
        _this.getCreateButton = helpers.getElementByDataQa('landing-home-button-create');
        _this.getJoinButton = helpers.getElementByDataQa('landing-home-button-join');
        _this.getJoinInput = helpers.getElementByDataQa('landing-home-join-input');
        _this.getJoinAutocompletions = helpers.getElementAllByDataQa('landing-home-join-autocomplete', 500);
        _this.getNewOrgNameInput = helpers.getElementByDataQa('landing-home-new-org-name');
        _this.getNewOrgTokenInput = helpers.getElementByDataQa('landing-home-new-org-token');
        _this.getNewOrgSymbolInput = helpers.getElementByDataQa('landing-home-new-org-symbol');
        _this.getNewOrgDecimalsInput = helpers.getElementByDataQa('landing-home-new-org-decimals');
        _this.getNewOrgDirectoryCheckbox = helpers.getElementByDataQa('landing-home-new-org-directory');
        _this.getNewOrgCreateButton = helpers.getElementByDataQa('landing-home-new-org-create');
        _this.getCreatedOrgContent = helpers.getElementByDataQa('landing-home-created-org-content', 2000);
        return _this;
    }
    LandingHomePage.prototype.navigateTo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToPath('/')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LandingHomePage.prototype.getSection = function (sectionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSections()];
                    case 1: return [2 /*return*/, (_a.sent())[sectionNumber]];
                }
            });
        });
    };
    LandingHomePage.prototype.getSectionContent = function (sectionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var section, getTextOf, pContent, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getSection(sectionNumber)];
                    case 1:
                        section = _b.sent();
                        getTextOf = function (selector) { return __awaiter(_this, void 0, void 0, function () {
                            var contentElem;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        contentElem = section.element(protractor_1.by.css(selector));
                                        return [4 /*yield*/, protractor_1.browser.isElementPresent(contentElem)];
                                    case 1:
                                        if (!_a.sent()) return [3 /*break*/, 3];
                                        return [4 /*yield*/, contentElem.getText()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3: return [2 /*return*/, undefined];
                                }
                            });
                        }); };
                        return [4 /*yield*/, helpers.getElementAll(protractor_1.by.css('p'), undefined, section)()];
                    case 2:
                        pContent = (_b.sent())
                            .map(function (p) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, p.getText()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        _a = {};
                        return [4 /*yield*/, getTextOf('h2')];
                    case 3:
                        _a.h2 = _b.sent();
                        return [4 /*yield*/, getTextOf('h3')];
                    case 4:
                        _a.h3 = _b.sent();
                        return [4 /*yield*/, Promise.all(pContent)];
                    case 5: return [2 /*return*/, (_a.p = _b.sent(),
                            _a)];
                }
            });
        });
    };
    LandingHomePage.prototype.setNewOrganizationForm = function (name, token, symbol, decimals, directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNewOrgNameInput.waitUntil()];
                    case 1: return [4 /*yield*/, (_a.sent()).clear().sendKeys(name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getNewOrgTokenInput.waitUntil()];
                    case 3: return [4 /*yield*/, (_a.sent()).clear().sendKeys(token)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getNewOrgSymbolInput.waitUntil()];
                    case 5: return [4 /*yield*/, (_a.sent()).clear().sendKeys(symbol)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.getNewOrgDecimalsInput.waitUntil()];
                    case 7: return [4 /*yield*/, (_a.sent()).clear().sendKeys(String(decimals))];
                    case 8:
                        _a.sent();
                        if (!directory) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.getNewOrgDirectoryCheckbox()];
                    case 9: return [4 /*yield*/, (_a.sent()).click()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return LandingHomePage;
}(page_abstract_po_1.Page));
exports.LandingHomePage = LandingHomePage;
//# sourceMappingURL=home.po.js.map