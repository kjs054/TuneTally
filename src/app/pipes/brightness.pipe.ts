import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brightness'
})
export class BrightnessPipe implements PipeTransform {

  transform(value: string): unknown {
    /* tslint:disable:no-bitwise */
    value = value ? value.replace(/^#/, '') : 'ffffff';      // strip #
    const rgb = parseInt(value, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = (rgb >> 0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    if (luma < 15) {
      return this.colorShade(value, 40);
    } else if (luma > 200) {
      return this.colorShade(value, -150);
    } else {
      return '#' + value;
    }
    /* tslint:enable:no-bitwise */
  }

  colorShade(col, amt) {
    col = col.replace(/^#/, '');
    if (col.length === 3) {
      col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
    }
    let [r, g, b] = col.match(/.{2}/g);
    ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt]);
    r = Math.max(Math.min(255, r), 0).toString(16);
    g = Math.max(Math.min(255, g), 0).toString(16);
    b = Math.max(Math.min(255, b), 0).toString(16);
    const rr = (r.length < 2 ? '0' : '') + r;
    const gg = (g.length < 2 ? '0' : '') + g;
    const bb = (b.length < 2 ? '0' : '') + b;
    return `#${rr}${gg}${bb}`;
  }
}
