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
Object.defineProperty(exports, "__esModule", { value: true });
var content_base_abstract_1 = require("./content-base.abstract");
var ContentBaseExtendedComponent = /** @class */ (function (_super) {
    __extends(ContentBaseExtendedComponent, _super);
    function ContentBaseExtendedComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContentBaseExtendedComponent;
}(content_base_abstract_1.ContentBaseComponent));
describe('ContentBaseComponent', function () {
    var changeDetectorRefMarkForCheckSpy = jasmine.createSpy('markForCheck');
    var component;
    beforeEach(function () {
        component = new ContentBaseExtendedComponent({ markForCheck: changeDetectorRefMarkForCheckSpy });
        component.ngOnInit();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should be visible after an small delay', function (done) {
        expect(component.visible).toBeUndefined();
        setTimeout(function () {
            expect(component.visible).toBeTruthy();
            expect(changeDetectorRefMarkForCheckSpy).toHaveBeenCalled();
            done();
        }, 100);
    });
});
//# sourceMappingURL=content-base.abstract.spec.js.map