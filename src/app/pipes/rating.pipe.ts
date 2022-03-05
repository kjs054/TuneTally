import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rating' })
export class RatingPipe implements PipeTransform {
  constructor() {}
  transform(value) {
    if (value > 7) { return 'positive'; } else
    if (value >= 4) { return 'neutral'; } else
    if (value < 4 && value > 0) { return 'negative'; }
    return 'undefined';
  }
}
