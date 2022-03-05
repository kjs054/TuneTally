import { AfterViewInit, Component, ElementRef, Inject, OnDestroy } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { ToggleService } from '../services/toggle.service';
import { Title } from '@angular/platform-browser';
import { RatingService } from '../services/rating.service';
import { catchError, flatMap, mergeMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { AppMessageQueueService } from '../services/app-message-queue-service.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewInit, OnDestroy {

  currentUser: User;
  usersTopArtists = [];
  usersTopTracks = [];
  usersRecentlyPlayed = [];
  latestReleases = [];
  recentlyRated = [];
  itemsPerRow;

  rightMenu;

  constructor(public spotifyService: SpotifyService,
              private elementRef: ElementRef,
              public toggleService: ToggleService,
              private titleService: Title,
              private authService: AuthService,
              private ratingServcice: RatingService,
              private appMsgService: AppMessageQueueService,
              @Inject(DOCUMENT) private document) { }

  ngAfterViewInit() {
    this.titleService.setTitle('TuneTally. Your music, your way.');
    this.document.body.style.background = 'linear-gradient(160deg, #F8F9FE, #ebf7ff)';
    const parentElement = this.elementRef.nativeElement;
    const resultsElement = parentElement.querySelector('#results').children[1].children[0];
    this.rightMenu = this.elementRef.nativeElement.parentElement.querySelector('#right-action-menu');
    if (window.innerWidth > 1026) {
      this.rightMenu.style.right = '42vw';
    }
    this.itemsPerRow = (Math.floor(resultsElement.clientWidth / 166) * 2);
    if (this.itemsPerRow < 12) {
      this.itemsPerRow = 12;
    }
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    const dataCalls = [
      this.ratingServcice.getRecentlyRated(this.itemsPerRow),
      this.spotifyService.getUsersTopTracks(this.itemsPerRow, 'short_term'),
      this.spotifyService.getUsersRecentlyPlayed(this.itemsPerRow),
      this.spotifyService.getUsersTopArtists(this.itemsPerRow, 'short_term')
    ].map(v => v.pipe(catchError(err => of(undefined))));
    this.spotifyService.getLatestReleases(this.itemsPerRow).pipe(mergeMap(latestReleases => {
      this.latestReleases = latestReleases.filter(el => el != null);
      return combineLatest(dataCalls);
    }),
      flatMap(([recentlyRatedDocs, topTracks, recentlyPlayed, topArtists]) => {
        this.usersTopTracks = topTracks;
        this.usersTopArtists = topArtists;
        this.usersRecentlyPlayed = recentlyPlayed;
        const ids = recentlyRatedDocs.map(v => v.release_id);
        return ids.length > 0 ? this.spotifyService.getMultipleReleases(ids.toString()) : of(undefined);
      })).subscribe(releases => {
        if (releases) {
          this.recentlyRated = releases.filter(el => el != null);
        } else {
          this.recentlyRated = undefined;
        }
      });

  }

  ngOnDestroy() {
    if (window.innerWidth > 1026) {
      this.rightMenu.style.right = '2vw';
    }
  }
}
