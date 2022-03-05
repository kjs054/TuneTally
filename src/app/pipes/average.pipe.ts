import { Pipe, PipeTransform } from '@angular/core';
import { Release } from '../model/release.model';

@Pipe({
  name: 'average'
})
export class AveragePipe implements PipeTransform {

  transform(oldValue: number, newValue: number, release: Release): number {
    if (release.ratings_count > 0) {
      if (oldValue && newValue) {
        return (((release.rating * release.ratings_count) - oldValue) + newValue) / release.ratings_count;
      } else if (oldValue && !newValue) {
        return ((release.rating * release.ratings_count) - oldValue ) / (release.ratings_count - 1);
      } else if (newValue && !oldValue) {
        return ((release.rating * release.ratings_count) + newValue) / (release.ratings_count + 1);
      }
    } else {
      return newValue;
    }
  }
}
