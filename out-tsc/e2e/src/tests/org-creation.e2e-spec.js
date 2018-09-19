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
var home_po_1 = require("../pages/home.po");
var helpers = require("../helpers");
describe('Organization creation', function () {
    var landingHomePage;
    beforeEach(function () {
        landingHomePage = new home_po_1.LandingHomePage();
    });
    it('should be able to access', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, landingHomePage.navigateTo()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the joining card available', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    _c = (_b = helpers).isPresent;
                    return [4 /*yield*/, landingHomePage.getJoinCard.waitUntil()];
                case 1: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to search the organization by address', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    _c = (_b = helpers).isPresent;
                    return [4 /*yield*/, landingHomePage.getJoinCard()];
                case 1: return [4 /*yield*/, _c.apply(_b, [_e.sent()])];
                case 2:
                    _a.apply(void 0, [_e.sent()]).toBeTruthy();
                    return [4 /*yield*/, landingHomePage.getJoinInput()];
                case 3: return [4 /*yield*/, (_e.sent()).clear().sendKeys('0x')];
                case 4:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, landingHomePage.getJoinInput()];
                case 5: return [4 /*yield*/, (_e.sent()).getAttribute('value')];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe('0x');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a new organization', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, landingHomePage.navigateTo()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, landingHomePage.getCreateButton.waitUntil(100)];
                case 2:
                    (_h.sent()).click();
                    return [4 /*yield*/, landingHomePage.getNewOrgCard.waitUntil()];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, landingHomePage.getNewOrgNameInput.waitUntil()];
                case 4:
                    _h.sent();
                    _a = expect;
                    _c = (_b = helpers).isPresent;
                    return [4 /*yield*/, landingHomePage.getJoinCard()];
                case 5: return [4 /*yield*/, _c.apply(_b, [_h.sent()])];
                case 6:
                    _a.apply(void 0, [_h.sent()]).toBeFalsy();
                    _d = expect;
                    _f = (_e = helpers).isPresent;
                    return [4 /*yield*/, landingHomePage.getNewOrgCard()];
                case 7: return [4 /*yield*/, _f.apply(_e, [_h.sent()])];
                case 8:
                    _d.apply(void 0, [_h.sent()]).toBeTruthy();
                    return [4 /*yield*/, landingHomePage.setNewOrganizationForm('Org e2e', 'OrgToken', 'e2e', 1)];
                case 9:
                    _h.sent();
                    return [4 /*yield*/, landingHomePage.getNewOrgCreateButton()];
                case 10:
                    (_h.sent()).click();
                    _g = expect;
                    return [4 /*yield*/, landingHomePage.getCreatedOrgContent.waitUntil(300)];
                case 11: return [4 /*yield*/, (_h.sent()).getText()];
                case 12:
                    _g.apply(void 0, [_h.sent()]).toBe("Org e2e\nLet's start\nopen");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create a new organization and add it on the directory', function () { return __awaiter(_this, void 0, void 0, function () {
        var orgsNumber, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, landingHomePage.navigateTo()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.getJoinInput.waitUntil()];
                case 2: return [4 /*yield*/, (_b.sent()).clear().sendKeys('0x')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.getJoinAutocompletions.waitUntil(undefined, true)];
                case 4:
                    orgsNumber = (_b.sent()).length;
                    return [4 /*yield*/, landingHomePage.navigateTo()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.getCreateButton.waitUntil(300)];
                case 6:
                    (_b.sent()).click();
                    return [4 /*yield*/, landingHomePage.setNewOrganizationForm('Org e2e', 'OrgToken', 'e2e', 1, true)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.getNewOrgCreateButton()];
                case 8:
                    (_b.sent()).click();
                    return [4 /*yield*/, landingHomePage.getCreatedOrgCard.waitUntil()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.navigateTo()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, landingHomePage.getJoinInput.waitUntil()];
                case 11: return [4 /*yield*/, (_b.sent()).clear().sendKeys('0x')];
                case 12:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, landingHomePage.getJoinAutocompletions.waitUntil(200)];
                case 13:
                    _a.apply(void 0, [(_b.sent()).length]).toBe(orgsNumber + 1);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=org-creation.e2e-spec.js.map