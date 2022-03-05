import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged( user => {
      if (user) {
        this.authService.authenticateSpotify().subscribe(() => this.router.navigateByUrl('/'));
      }
    });
  }
}
