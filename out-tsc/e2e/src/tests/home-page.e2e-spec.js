"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
var home_po_1 = require("../pages/home.po");
var helpers = require("../helpers");
describe('Landing page', function () {
    var page;
    beforeEach(function () {
        page = new home_po_1.LandingHomePage();
    });
    it('should be able to access', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the correct title', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, helpers.getTitle()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe('EthKudos - Time to reward');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display 4 sections', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getSections()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).length]).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the first section showing the correct content', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getSectionContent(0)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        h2: 'Connecting coworkers',
                        h3: 'Join an organisation',
                        p: [
                            'EthKudos provides an opportunity of gratifying the team collaboration.',
                            'Each member rewards people who helped him or her,\nencouraging and recognizing team cooperation between members.',
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the second section showing the correct content', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getSectionContent(1)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        h2: 'Your organisation or team, your token',
                        h3: 'The more Kudos a member  receives, the more prestige',
                        p: [
                            'Each member will have some kudos to reward other coworkers,\nsending a message that will be seen by the receivers.',
                            'There is a limit of kudos sendings, which ensures that all the\nmembers respect the rules and promote gratitude between members.',
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the third section showing the correct content', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getSectionContent(2)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        h2: 'Polling time! Time to reward!',
                        h3: 'The members are sending gratitude to people that have helped',
                        p: [
                            'Each message will increase motivation and improve the team\'s relationship,\nthe team cooperation won\'t be forgotten.',
                            'Your organisation is able to use the polling data to gratify the members.\nSo, wouldn\'t you like to have EthKudos on your team?',
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the fourth section showing the correct content', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getSectionContent(3)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        h2: 'Why beta? Why ropsten*?',
                        h3: 'We want to improve EthKudos, we need your feedback!',
                        p: [
                            'You can give us your feedback on GitHub.\nTell us how is your team using EthKudos and what are you missing.',
                            'Help us to speed up the deployment on Ethereum main network.\nCreate your organisation, give us some feedback and donate some Ether.',
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to FAQs page clicking on header help icon', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getHeaderFaqsButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/faqs');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to donation page clicking on support the project section', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getSectionDonateButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/donate');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to GitHub clicking on footer GitHub button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getFooterGithubButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getNewTabUrlAndClose()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('https://github.com/Pedro-vk/EthKudos');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to FAQs page clicking on footer FAQs button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getFooterFaqsButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/faqs');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to About page clicking on footer About button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getFooterAboutButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/about');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to Privacy Policy page clicking on footer Privacy Policy button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getFooterPrivacyButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/privacy-policy');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should go to Donate page clicking on footer Donate button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.navigateTo()];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('/');
                    return [4 /*yield*/, page.getFooterDonateButton()];
                case 3:
                    (_c.sent()).click();
                    _b = expect;
                    return [4 /*yield*/, helpers.getPath()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('/donate');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=home-page.e2e-spec.js.map