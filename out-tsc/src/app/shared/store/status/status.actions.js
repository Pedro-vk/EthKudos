"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_STATUS = 'status - set status';
// Status
var SetStatusAction = /** @class */ (function () {
    function SetStatusAction(payload) {
        this.payload = payload;
        this.type = exports.SET_STATUS;
    }
    return SetStatusAction;
}());
exports.SetStatusAction = SetStatusAction;
//# sourceMappingURL=status.actions.js.map