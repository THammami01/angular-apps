import { trigger, style, animate, transition } from '@angular/animations';

export const fadeSlideInOutAnimation = trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
  ]),
]);