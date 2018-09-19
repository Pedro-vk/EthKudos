"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/shareReplay");
var environment_1 = require("../../environments/environment");
var ServiceWorkerService = /** @class */ (function () {
    function ServiceWorkerService() {
        var _this = this;
        this._onUpdate = new Subject_1.Subject();
        this.onUpdate = this._onUpdate.asObservable().shareReplay();
        if ('serviceWorker' in navigator && environment_1.environment.production) {
            navigator.serviceWorker.register('/ngsw-worker.js');
            navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (navigator.serviceWorker.controller !== null) {
                    navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
                }
            });
            navigator.serviceWorker.onmessage = function (message) {
                if (message.data.type === 'UPDATE_AVAILABLE') {
                    _this._onUpdate.next();
                }
            };
            this.initCheckForUpdates();
        }
    }
    ServiceWorkerService.prototype.initCheckForUpdates = function () {
        var _this = this;
        setInterval(function () { return _this.checkForUpdates(); }, 60 * 1000);
    };
    ServiceWorkerService.prototype.checkForUpdates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusNonce;
            return __generator(this, function (_a) {
                if (navigator.serviceWorker.controller !== null) {
                    statusNonce = Math.round(Math.random() * Math.pow(10, 8));
                    navigator.serviceWorker.controller.postMessage({ action: 'CHECK_FOR_UPDATES', statusNonce: statusNonce });
                }
                return [2 /*return*/];
            });
        });
    };
    ServiceWorkerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ServiceWorkerService);
    return ServiceWorkerService;
}());
exports.ServiceWorkerService = ServiceWorkerService;
//# sourceMappingURL=service-worker.service.js.map