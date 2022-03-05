import { Injectable } from '@angular/core';
import Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicColorService {

  palette = new Subject<Palette>();
  globalVarObserver = this.palette.asObservable();

  constructor() {}

  update(input) {
    this.palette.next(input);
  }
}
