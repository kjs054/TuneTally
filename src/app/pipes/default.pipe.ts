import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

@Pipe({name: 'default', pure: true})
export class DefaultPipe implements PipeTransform {
   transform(value: any, defaultValue: any): any {
       if (value === undefined || value === null || value === '') {
           return defaultValue;
       } else {
           return value;
       }
   }
}
