import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { switchMap, first, mergeMap, map, tap, flatMap } from 'rxjs/operators';
import { User } from '../model/user.model';
import { firestore } from 'firebase/app';
import { SpotifyAuth } from '../model/spotifyAuth.model';
import Timestamp = firestore.Timestamp;
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private customHttpClient: HttpClient;

  private ratingsSource = new BehaviorSubject<DocumentData[]>([]);
  ratings = this.ratingsSource.asObservable();

  private user = new BehaviorSubject<User>(undefined);
  user$ = this.user.asObservable();

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private backend: HttpBackend) {
    this.customHttpClient = new HttpClient(backend);
    this.afAuth.authState.pipe(
      flatMap(user => {
        if (user) {
          return combineLatest(
            [
              this.db.collection('users').doc<User>(user.uid).valueChanges(),
              this.db.collection('spotify').doc(user.uid).valueChanges()
            ]
          );
        } else {
          this.user.next(undefined);
        }
      })
    ).subscribe(([userData, spotifyData]) => {
      if (spotifyData) {
        userData.spotify = spotifyData['spotify'];
      }
      this.user.next(userData);
    });
  }

  async getCurrentUserRatings() {
    const { uid } = await this.getUser();
    return this.db.collection('users').doc(uid).collection('ratings').get().subscribe(docs => this.ratingsSource.next(docs.docs) );
  }

  getUserDataById(uid) {
    return this.user$.pipe(mergeMap(user => {
      // Check if the user being fetched is the current user to avoid unnecessary requests
      if (user && user.uid === uid) {
        return this.user$;
      } else {
        return this.db.collection('users').doc(uid).get().pipe(map(doc => doc.data()));
      }
    }));
  }

  getUserRatingsbyId(uid) {
    return this.db.collection('users').doc(uid).collection('ratings').get();
  }


  async saveSpotifyToken(authData: SpotifyAuth) {
    const { uid } = await this.afAuth.currentUser;
    return this.db.collection('spotify').doc(uid).set({
      spotify: authData
    }, {merge: true});
  }

  async addUserData(userData) {
    const { uid } = await this.afAuth.currentUser;
    return this.db.collection('users').doc(uid).set({
      ...userData,
      joined: Timestamp.fromDate(new Date())
    });
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  authenticateSpotify(refreshToken?: string) {
    const url = environment.backend + 'authenticate';
    const code = new URLSearchParams(location.search).get('code');
    let params = new HttpParams();
    if (code) {
      params = params.append('code', code);
    } else if (refreshToken) {
      params = params.append('refresh_token', refreshToken);
    }
    return this.customHttpClient.get(url, { params }).pipe(
      map(res => {
        if (res.hasOwnProperty('access_token')) {
          const authResponse = res as SpotifyAuth;
          if (code || refreshToken) {
            this.saveSpotifyToken(authResponse);
          } else {
            Object.keys(authResponse).forEach(key => {
              localStorage.setItem(key, authResponse[key]);
            });
          }
          return authResponse.access_token;
        }
      })
    );
  }
}
