import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { Alert } from '../model/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSource = new Subject<Alert>();
  alert = this.alertSource.asObservable();

  constructor() {}

  update(status, message) {
    this.alertSource.next({status, message});
    timer(5000).subscribe(() => {
      this.clearAlert();
    });
  }

  clearAlert() {
    this.alertSource.next(null);
  }
}
