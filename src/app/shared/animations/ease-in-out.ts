import { trigger, state, style, transition, animate } from '@angular/animations';

export function easeInOutAnimationTime(time: number) {
  return trigger('easeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate(`${time}ms ease-in-out`, style({opacity: 1})),
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate(`${time}ms ease-in-out`, style({opacity: 0})),
    ]),
  ]);
}

export const easeInOutAnimation = easeInOutAnimationTime(300);
export const easeInOutSlowAnimation = easeInOutAnimationTime(500);
