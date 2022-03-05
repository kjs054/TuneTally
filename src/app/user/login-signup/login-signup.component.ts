import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/model/user.model';
import { first, take } from 'rxjs/operators';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})

export class LoginSignupComponent {

  serverMessage: string;
  showConnectSpotify = false;
  userData: User;

  constructor(public authService: AuthService,
              private afAuth: AngularFireAuth,
              public spotifyService: SpotifyService,
              private alertService: AlertService,
              public dialogRef: MatDialogRef<LoginSignupComponent>) {}

  logInWithGoogle() {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(result => {
      this.userData = {
                        display_name: result.user.displayName,
                        email: result.user.email,
                        image_url: result.user.photoURL,
                        uid: result.user.uid,
                      };
      this.saveUser();
    }).catch(error => {
      this.alertService.update('negative', error.code);
    });
  }

  logInWithFacebook() {
    return this.afAuth.signInWithPopup(new auth.FacebookAuthProvider()).then(result => {
      this.saveUser();
    }).catch(error => {
      this.alertService.update('negative', error.code);
    });
  }

  // Set user profile data once OAuth credential is recieved
  saveUser() {
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.showConnectSpotify = true;
        this.authService.addUserData(this.userData);
      }
    });
  }
}
