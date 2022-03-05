import { trigger, transition, style, query, group, animateChild, animate, keyframes, state } from '@angular/animations';

export const slider =
    trigger('routeAnimations', [
        transition('* <=> *', slideTo('left'))
    ]);

export const slideUpDown =
    trigger('slideUpDown', [
    transition(':enter', [style({height: 0, overflow: 'hidden'}), animate('.3s ease', style({height: '*', 'padding-top': '*', 'padding-bottom': '*', 'padding-left': '*'}))]),
    transition(':leave', [style({height: '*', overflow: 'hidden'}), animate('.3s ease', style({height: 0, 'padding-top': 0, 'padding-right': 0, 'padding-bottom': 0, 'padding-left': 0}))])
  ]);

export const slideIn =
    trigger('slideIn', [
    transition(':enter', [style({top: '-15vh'}), animate('.3s ease', style({top: '*', padding: '*'}))]),
    transition(':leave', [style({height: '*'}), animate('.3s ease', style({top: '-15vh'}))])
    ]);

export const fade =
  trigger('fade', [
    state('void', style({opacity: 0})),
    transition(':enter, :leave', [
        animate(200)
      ])
    ]);

function slideTo(direction) {
    const optional = {optional: true};
    return [ query(':enter, :leave', [
        style({
            position: 'absolute',
            top: 0,
            [direction]: 0,
            width: '100%'
        })
    ], optional),
    query(':enter', [
        style({[direction]: '-100%'})
    ]),
    group([
        query(':leave', [
            animate('600ms ease', style({[direction]: '100%'}))
        ], optional),
        query(':enter', [
            animate('600ms ease', style({[direction]: '0%'}))
        ])
    ])
    ];
}
