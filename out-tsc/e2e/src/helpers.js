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
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
// URL helpers
function getTitle() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.getTitle()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getTitle = getTitle;
function getUrl() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getUrl = getUrl;
function getPath() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 1: return [2 /*return*/, (_a.sent()).replace(/^[^#]*?:\/\/.*?(\/.*)$/, '$1')];
            }
        });
    });
}
exports.getPath = getPath;
function getNewTabUrlAndClose() {
    return __awaiter(this, void 0, void 0, function () {
        var handles, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                case 1:
                    handles = _a.sent();
                    protractor_1.browser.driver.switchTo().window(handles[1]);
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 2:
                    url = _a.sent();
                    protractor_1.browser.driver.close();
                    protractor_1.browser.driver.switchTo().window(handles[0]);
                    return [2 /*return*/, url];
            }
        });
    });
}
exports.getNewTabUrlAndClose = getNewTabUrlAndClose;
// Key sedings
function sendEscKey() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.element(protractor_1.by.css('body'))];
                case 1: return [4 /*yield*/, (_a.sent()).sendKeys(protractor_1.protractor.Key.ESCAPE)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.sendEscKey = sendEscKey;
// Presence/visibility helpers
function isPresent(elementFinder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.isElementPresent(elementFinder)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.isPresent = isPresent;
function isDisplayed(elementFinder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isPresent(elementFinder)];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, elementFinder.isDisplayed()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.isDisplayed = isDisplayed;
// Wait until helpers
function waitUntil(elementFinder, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(protractor_1.ExpectedConditions.presenceOf(elementFinder), timeout, "Element '" + elementFinder.locator() + "' not found in DOM")];
                case 1:
                    _a.sent();
                    return [2 /*return*/, elementFinder];
            }
        });
    });
}
exports.waitUntil = waitUntil;
function waitUntilCss(selector, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntil(protractor_1.element(protractor_1.by.css(selector)), timeout)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.waitUntilCss = waitUntilCss;
function generateAccessor(elementGetter, locator, waitDelay) {
    var _this = this;
    if (waitDelay === void 0) { waitDelay = 0; }
    var accessor = (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, elementGetter()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); });
    accessor.waitUntil = function (delay, skipUntil) {
        if (delay === void 0) { delay = 0; }
        if (skipUntil === void 0) { skipUntil = false; }
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!skipUntil) return [3 /*break*/, 2];
                        return [4 /*yield*/, waitUntilElement(locator)()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, protractor_1.browser.sleep(Math.max(waitDelay, delay))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, elementGetter()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return accessor;
}
function getElement(locator, waitDelay, ofElement) {
    var _this = this;
    var getter = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (ofElement ? ofElement.element(locator) : protractor_1.element(locator))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); };
    return generateAccessor(getter, locator, waitDelay);
}
exports.getElement = getElement;
function getElementAll(locator, waitDelay, ofElement) {
    var _this = this;
    var getter = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (ofElement ? ofElement.all(locator) : protractor_1.element.all(locator))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); };
    return generateAccessor(getter, locator, waitDelay);
}
exports.getElementAll = getElementAll;
function waitUntilElement(locator, timeout, delay) {
    var _this = this;
    if (timeout === void 0) { timeout = 5000; }
    if (delay === void 0) { delay = 0; }
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var e;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitUntil(protractor_1.element(locator), timeout)];
                case 1:
                    e = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(delay)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, e];
            }
        });
    }); };
}
exports.waitUntilElement = waitUntilElement;
// Data Qa accessors helpers
function getElementByDataQa(dataQa, waitDelay) {
    if (waitDelay === void 0) { waitDelay = 0; }
    return getElement(protractor_1.by.css("[data-qa=\"" + dataQa + "\"]"), waitDelay);
}
exports.getElementByDataQa = getElementByDataQa;
function getElementAllByDataQa(dataQa, waitDelay) {
    if (waitDelay === void 0) { waitDelay = 0; }
    return getElementAll(protractor_1.by.css("[data-qa=\"" + dataQa + "\"]"), waitDelay);
}
exports.getElementAllByDataQa = getElementAllByDataQa;
function waitUntilElementByDataQa(dataQa, timeout, delay) {
    if (timeout === void 0) { timeout = 5000; }
    if (delay === void 0) { delay = 0; }
    return waitUntilElement(protractor_1.by.css("[data-qa=\"" + dataQa + "\"]"), timeout, delay);
}
exports.waitUntilElementByDataQa = waitUntilElementByDataQa;
//# sourceMappingURL=helpers.js.map