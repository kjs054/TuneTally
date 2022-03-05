import { Component, Input } from '@angular/core';
import { slideUpDown } from 'src/app/route-animations';
import { Alert } from 'src/app/model/alert.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [slideUpDown]
})
export class AlertComponent {

  alert: Alert;

  constructor(alertService: AlertService) {
    alertService.alert.subscribe(alert => {
      this.alert = alert;
    });
  }
}
