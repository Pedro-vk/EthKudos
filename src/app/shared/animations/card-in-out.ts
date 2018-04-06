import { AnimationEntryMetadata } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

export const cardInOutAnimation: AnimationEntryMetadata = trigger('cardInOut', [
  transition(':enter', [
    style({opacity: 0, top: '-40px', height: 0, 'padding-top': 0, 'padding-bottom': 0}),
    animate('.3s ease-in-out', style({opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*'})),
  ]),
  transition(':leave', [
    style({opacity: 1, top: 0, height: '*', 'padding-top': '*', 'padding-bottom': '*'}),
    animate('.3s ease-in-out', style({opacity: 0, top: '40px', height: 0, 'padding-top': 0, 'padding-bottom': 0})),
  ]),
]);
