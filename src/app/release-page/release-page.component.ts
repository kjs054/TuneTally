import { Component, Renderer2, ElementRef, ViewChild, OnDestroy, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Release } from '../model/release.model';
import { SafeResourceUrl, Title } from '@angular/platform-browser';
import { AppMessageQueueService } from '../services/app-message-queue-service.service';
import { MatSliderChange } from '@angular/material/slider';
import Vibrant from 'node-vibrant';
import { DynamicColorService } from '../services/dynamic-color-service.service';
import { RatingService } from '../services/rating.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Rating } from '../model/rating.model';
import { ModalService } from '../services/modal.service';
import { flatMap, map, mergeMap, tap, take, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { AveragePipe } from '../pipes/average.pipe';
import { fade, slideUpDown } from '../route-animations';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';
import { BrightnessPipe } from '../pipes/brightness.pipe';
import { UserToObjectPipe } from '../pipes/user-to-object.pipe';

@Component({
  selector: 'app-release-page',
  templateUrl: './release-page.component.html',
  styleUrls: ['./release-page.component.css'],
  animations: [fade, slideUpDown]
})

/* The biggest mess in the app. Has to handle a lot of one-time elements */
export class ReleasePageComponent implements OnInit, OnDestroy {

  // Release and release related variables
  release?: Release;
  embedUrl: SafeResourceUrl;
  recommendedReleases: Release[];
  comments: Rating[] = [];
  ratings: Rating[] = [];
  userRank: number;
  userRating: number;
  previousRatingSliderValue: number;
  userComment?: Rating;

  // Display and appearance variables
  backgroundColor;
  showNextReleasePreview = false;
  showPrevReleasePreview = false;
  showRatings = false;
  showAddCommentBlock: boolean;
  sliderActive = false;
  ratingSliderChanged = false;
  content: string;
  ratingSliderValue: number;

  @ViewChild('addRatingButton') addRatingButton: ElementRef;

  constructor(public appMsgService: AppMessageQueueService,
              private spotifyService: SpotifyService,
              public ratingService: RatingService,
              private route: ActivatedRoute,
              private afAuth: AngularFireAuth,
              private router: Router,
              public modalService: ModalService,
              private dynamicColorService: DynamicColorService,
              private renderer: Renderer2,
              private average: AveragePipe,
              private userToObject: UserToObjectPipe,
              private alertService: AlertService,
              private authService: AuthService,
              private titleService: Title,
              private brightness: BrightnessPipe,
              @Inject(DOCUMENT) private document) {

    this.modalService.updatedData.subscribe(data => {
      const updatedTrack = this.release.tracks.find(track => track.id === data.track.id);
      updatedTrack.rating = this.average.transform(updatedTrack.rating, data.rating, updatedTrack);
    });
    this.renderer.listen('window', 'mousedown', (e: Event) => {
      if (!((e.target as Element).className.includes('mat-slider')) && e.target !== this.addRatingButton.nativeElement) {
        this.sliderActive = false;
        this.ratingSliderValue = this.userRating;
        this.ratingSliderChanged = false;
      }
    });

  }

  ngOnInit() {
    this.titleService.setTitle('loading');
    const params$ = this.route.params;
    const release$ = params$.pipe(flatMap((params) => this.spotifyService.getRelease(params.id)));
    const recommendations$ = release$.pipe(mergeMap(release => {
                               const artists = release.artists.map(artist => artist.id).toString();
                               return this.spotifyService.getReleaseRecommendations(artists, release.id);
                             }));
    release$.pipe(
      map(release => {
        this.release = release;
        this.titleService.setTitle(this.release.artists[0].name + ' - ' + this.release.name);
        this.embedUrl = 'https://open.spotify.com/embed/album/' + release.id;
        this.setColors();
        this.getRatingAndCommentData();
        this.getRanks();
        this.getTrackRatings();
      }),
      flatMap(() => recommendations$))
      .subscribe(recs => this.recommendedReleases = recs, take(1));
  }

  ngOnDestroy() {
    this.document.body.style.background = 'linear-gradient(160deg, #F8F9FE, #ebf7ff)';
  }

  getRatingAndCommentData() {
    const average$ = this.ratingService.getReleaseAverageRating(this.release.id);
    const comments$ = this.ratingService.getReleaseComments(this.release.id);
    const ratings$ = this.ratingService.getReleaseRatings(this.release.id);

    average$.pipe(
      tap(data => {
        this.release.rating = data ? data.rating : 0;
        this.release.ratings_count = data ? data.count : 0;
      }),
      mergeMap(v => combineLatest([comments$, ratings$])),
      map(([comments, ratings]) => ({comments, ratings})),
      map(objects => this.userToObject.transform(objects)),
      mergeMap(objectsWithUsers => objectsWithUsers))
      .subscribe(objectsWithUsers => {
        this.comments = objectsWithUsers.comments;
        this.ratings = objectsWithUsers.ratings;
      });
  }

  async getRanks() {
    const user = await this.authService.getUser();
    if (user) {
      const userRating$ = this.ratingService.getUserRating(this.release.id);
      userRating$.pipe(
        flatMap(data => {
          if (data) {
            this.userRating = data.rating;
            this.previousRatingSliderValue = data.rating;
            this.ratingSliderValue = data.rating;
            return this.userRating ? this.ratingService.getUsersReleaseRank(this.userRating) : of(undefined);
          }
        }),
        catchError(error => of(undefined))
      ).subscribe(rank => this.userRank = rank, take(1));
    }
  }

  getTrackRatings() {
    this.release.tracks.forEach(track => {
      this.ratingService.getReleaseAverageRating(track.id).pipe(tap(data => {
        track.rating = data ? data.rating : 0;
        track.ratings_count = data ? data.count : 0;
      })).subscribe(take(1));
    });
  }

  setColors() {
    Vibrant.from(this.release.images[0].url).getPalette((err, palette) => {
      this.backgroundColor = this.brightness.transform(palette.DarkVibrant.getHex());
      this.dynamicColorService.update(palette);
      this.modalService.mainColor = this.backgroundColor;
      this.document.body.style.background = this.backgroundColor ;
    });
  }

  async addRatingClicked(track?: Rating) {
    const user = await this.authService.getUser();
    if (user) {
      // If track is defined user is rating a track not the release
      if (track) {
        this.modalService.openRatingDialog(track);
      } else {
        this.ratingSliderChanged = false;
        this.ratingService.addRating(this.release, this.ratingSliderValue, this.previousRatingSliderValue).then(() => {
          this.release.rating = this.average.transform(this.userRating, this.ratingSliderValue, this.release);
          if (!this.userRating) {
            this.release.ratings_count += 1;
          }
          this.previousRatingSliderValue = this.ratingSliderValue;
        });
        this.sliderActive = false;
      }
    } else {
      this.modalService.openLoginDialog();
    }
  }

  async deleteRatingClicked(track?: Rating) {
    const user = await this.authService.getUser();
    if (user) {
        this.ratingService.removeRating(this.release, this.userRating).then(() => {
          this.release.rating = this.average.transform(this.userRating, undefined, this.release);
          this.userRating = null;
          this.release.ratings_count -= 1;
          this.ratingSliderValue = 0;
        });
        this.sliderActive = false;
    } else {
      this.modalService.openLoginDialog();
    }
  }

  get artistsNames() {
    return this.release.artists.map(artist => artist.name);
  }

  // To avoid taxing firebase live listeners, update the releases score on the client side for their new rating
  navigateReleases(direction) {
    this.router.navigate(['/release', this.appMsgService.navigateReleases(direction, this.release.id).id]);
  }

  getAdjacentReleaseImage(direction) {
    return this.appMsgService.navigateReleases(direction, this.release.id).images[1].url;
  }

  onSliderChange(event: MatSliderChange) {
    this.ratingSliderValue = event.value;
    this.ratingSliderChanged = true;
  }

  async toggleShowAddComment() {
    const user = await this.authService.getUser();
    if (user) {
      this.showAddCommentBlock = !this.showAddCommentBlock;
    } else {
      this.modalService.openLoginDialog();
    }
  }

  toggleShowRatings() {
    this.showRatings = !this.showRatings;
  }

  valueChange(v) {
    if (v.length >= 280) {
      this.alertService.update('negative', 'Character limit reached');
    }
  }

  postCommentHandler() {
    if (this.afAuth.authState) {
      if (this.content.length >= 10) {
        this.ratingService.addRating(this.release, undefined, undefined, this.content).then(() => {
          this.content = '';
          this.showAddCommentBlock = false;
        }).catch(error => this.alertService.update('negative', 'Comment failed to post!'));
      } else {
        this.alertService.update('negative', 'Comments must be at least 10 characters long!');
      }
    } else {
      this.modalService.openLoginDialog();
    }
  }
}
