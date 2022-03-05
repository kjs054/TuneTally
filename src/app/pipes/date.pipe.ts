import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
  constructor() {}
  transform(value, precision?) {
    let format;
    switch (precision) {
      case 'day':
        format = 'MMMM dd yyyy';
        break;
      case 'year':
        format = 'yyyy';
        break;
      case 'month':
        format = 'MMMM yyyy';
        break;
      default:
        format = 'MMMM dd yyyy hh:mm a';
        break;
    }
    return formatDate(value, format, 'en-US');
  }
}
