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
var donate_po_1 = require("../pages/donate.po");
var helpers = require("../helpers");
describe('Donate page', function () {
    var page;
    beforeEach(function () {
        page = new donate_po_1.LandingDonatePage();
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
                    _a.apply(void 0, [_b.sent()]).toBe('EthKudos - Donate');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have the donation default value of 0.01', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getDonateInput()];
                case 1: return [4 /*yield*/, (_b.sent()).getAttribute('value')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe('0.01');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to change the donation value', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, page.getDonateInput()];
                case 1: return [4 /*yield*/, (_c.sent()).getAttribute('value')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('0.01');
                    return [4 /*yield*/, page.getDonateInput()];
                case 3: return [4 /*yield*/, (_c.sent()).clear().sendKeys('0.02')];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, page.getDonateInput()];
                case 5: return [4 /*yield*/, (_c.sent()).getAttribute('value')];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe('0.02');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to send transactions', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    _a = expect;
                    _c = (_b = helpers).isPresent;
                    return [4 /*yield*/, page.getTransactionBlock()];
                case 1: return [4 /*yield*/, _c.apply(_b, [_o.sent()])];
                case 2:
                    _a.apply(void 0, [_o.sent()]).toBeFalsy();
                    return [4 /*yield*/, page.sendDonation()];
                case 3:
                    _o.sent();
                    _d = expect;
                    _f = (_e = helpers).isPresent;
                    return [4 /*yield*/, page.getTransactionConfirmations()];
                case 4: return [4 /*yield*/, _f.apply(_e, [_o.sent()])];
                case 5:
                    _d.apply(void 0, [_o.sent()]).toBeFalsy();
                    return [4 /*yield*/, page.waitForTransactionConfirmed()];
                case 6:
                    _o.sent();
                    _g = expect;
                    return [4 /*yield*/, page.getTransactionCloseButton()];
                case 7: return [4 /*yield*/, (_o.sent()).isEnabled()];
                case 8:
                    _g.apply(void 0, [_o.sent()]).toBeTruthy();
                    _h = expect;
                    _k = (_j = helpers).isPresent;
                    return [4 /*yield*/, page.getTransactionConfirmations()];
                case 9: return [4 /*yield*/, _k.apply(_j, [_o.sent()])];
                case 10:
                    _h.apply(void 0, [_o.sent()]).toBeTruthy();
                    _l = expect;
                    return [4 /*yield*/, page.getTransactionConfirmations()];
                case 11: return [4 /*yield*/, (_o.sent()).getText()];
                case 12:
                    _l.apply(void 0, [_o.sent()]).toBe('check\n1');
                    _m = expect;
                    return [4 /*yield*/, page.getTransactionCloseButton()];
                case 13: return [4 /*yield*/, (_o.sent()).isEnabled()];
                case 14:
                    _m.apply(void 0, [_o.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=donate-page.e2e-spec.js.map