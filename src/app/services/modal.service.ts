import { Injectable } from '@angular/core';
import { LoginSignupComponent } from '../user/login-signup/login-signup.component';
import { RateTrackComponent } from '../rate-track/rate-track.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  mainColor: string;
  private updatedDataSource = new Subject<any>();
  updatedData = this.updatedDataSource.asObservable();

  constructor(private dialog: MatDialog) {
  }

  openLoginDialog() {
    this.dialog.open(LoginSignupComponent, {
      data: { color: this.mainColor }
    });
  }

  openRatingDialog(track) {
    let dialogRef = this.dialog.open(RateTrackComponent, {
      data: { color: this.mainColor, track }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.updatedDataSource.next({rating: res.rating, track});
    });
  }
}
