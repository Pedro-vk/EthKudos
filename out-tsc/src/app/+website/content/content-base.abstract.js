"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentBaseComponent = /** @class */ (function () {
    function ContentBaseComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    ContentBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.visible = true;
            _this.changeDetectorRef.markForCheck();
        }, 10);
    };
    return ContentBaseComponent;
}());
exports.ContentBaseComponent = ContentBaseComponent;
//# sourceMappingURL=content-base.abstract.js.map