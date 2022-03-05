import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SpotifyService } from './services/spotify.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  refreshTokenInProgress = false;
  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  accessToken;
  refreshToken;

  constructor(private router: Router, private authService: AuthService, private spotifyService: SpotifyService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle response
    return this.authService.user$.pipe(mergeMap(user => {
      if (user && user.spotify) {
        this.accessToken = user.spotify.access_token;
        this.refreshToken = user.spotify.refresh_token;
      } else {
        this.accessToken = localStorage.getItem('access_token');
      }
      if (this.accessToken) {
        const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
        req = req.clone({ headers });
      }
      return next.handle(req).pipe(catchError(error => {
        return this.handleResponseError(error, req, next);
      }));
    }));
  }

  refreshTheToken(refreshToken): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;
      return this.authService.authenticateSpotify(refreshToken).pipe(
        map(token => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next();
          return token;
        }),
        catchError(err => {
          this.refreshTokenInProgress = false;
          return throwError(err);
        }));
    }
  }

  handleResponseError(error, request?, next?) {
    // Business error
    if (error.status === 400) {
      // Show message
    }
    // Invalid token error
    else if (error.status === 401) {
      return this.refreshTheToken(this.refreshToken).pipe(
        switchMap(token => {
          const headers = new HttpHeaders( { Authorization: `Bearer ${token}` } );
          const newRequest = request.clone({headers});
          return next.handle(newRequest);
        }),
        catchError(e => {
          if (e.status !== 401) {
            return this.handleResponseError(e);
          }
        }));
    }

    return throwError(error);
  }
}
