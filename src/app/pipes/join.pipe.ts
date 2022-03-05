import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: string[], joinBy: string): string {
    for (let i = 0 ; i < value.length ; i++){
      value[i] = this.titleCase(value[i]);
    }
    return value.join(joinBy);
  }

  titleCase(str) {
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
 }
}
