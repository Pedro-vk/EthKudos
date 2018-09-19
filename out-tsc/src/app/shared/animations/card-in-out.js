"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
exports.cardInOutAnimation = animations_1.trigger('cardInOut', [
    animations_1.transition(':enter', [
        animations_1.style({ opacity: 0, top: '-40px', height: 0, 'padding-top': 0, 'padding-bottom': 0 }),
        animations_1.animate('.3s ease-in-out', animations_1.style({ opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*' })),
    ]),
    animations_1.transition(':leave', [
        animations_1.style({ opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*' }),
        animations_1.animate('.3s ease-in-out', animations_1.style({ opacity: 0, top: '40px', height: 0, 'padding-top': 0, 'padding-bottom': 0 })),
    ]),
]);
//# sourceMappingURL=card-in-out.js.map