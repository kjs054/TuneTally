import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, mergeMap, flatMap } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user.model';
import { ModalService } from '../services/modal.service';
import { AlertService } from '../services/alert.service';
import { Artist } from '../model/artist.model';
import { SpotifyService } from '../services/spotify.service';
import Vibrant from 'node-vibrant';
import { Title } from '@angular/platform-browser';
import { BrightnessPipe } from '../pipes/brightness.pipe';
import { DynamicColorService } from '../services/dynamic-color-service.service';
import { AuthService } from '../services/auth.service';
import { RatingService } from '../services/rating.service';
import { Rating } from '../model/rating.model';
import { Release } from '../model/release.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  user: User;
  mainColor;
  totalChart = [];
  userComments;
  avgRating: number;
  subscriptions = new Subscription();
  artistsIds: {artist: string, ratings: any[], average: number}[];
  currentTab = 'chart';
  ratedArtists: Artist[];
  isLoading: boolean;

  constructor(private authService: AuthService,
              public afAuth: AngularFireAuth,
              private router: ActivatedRoute,
              private modalService: ModalService,
              private alertService: AlertService,
              private spotifyService: SpotifyService,
              private brightness: BrightnessPipe,
              private dynamicColorService: DynamicColorService,
              private ratingsService: RatingService,
              private titleService: Title) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.router.params.pipe(
          map(params => params.id),
          mergeMap(id => combineLatest([this.authService.getUserDataById(id), this.authService.getUserRatingsbyId(id)])),
          map(([userData, ratings]) => {
            this.user = userData;
            this.setColors();
            this.titleService.setTitle(this.user.display_name);
            return this.transformRatings(ratings);
          }),
          map(ratings => {
            this.totalChart = ratings;
            return ratings.reduce((a, v) => a.concat(v.release.artists), []);
          }),
          map(artists => {
            return artists.map(artist => {
              const ratings = this.totalChart.filter(t => t.release.artists.some(a => a === artist));
              const average = ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length;
              return {artist, ratings, average};
            });
          }),
          map(artists => {
            return artists.reduce((arr, item) => {
              const exists = !!arr.find(x => x.artist === item.artist);
              if (!exists){ arr.push(item); }
              return arr;
            }, []).sort((a, b) => b.average - a.average);
          })
        ).subscribe(artists => {
          this.artistsIds = artists;
          this.isLoading = false;
        });
      } else {
        this.alertService.update('negative', 'Create an account or sign in to view user profiles.');
        this.modalService.openLoginDialog();
      }
    });
  }

  setColors() {
    Vibrant.from(this.user.image_url).getPalette((err, palette) => {
      this.mainColor = this.brightness.transform(palette.DarkVibrant.getHex());
      this.dynamicColorService.update(palette);
    });
  }

  changeTab(tab) {
    if (tab === 'artists') {
      this.changeArtistPage(0);
      this.currentTab = 'artists';
    } else if (tab === 'chart') {
      this.currentTab = 'chart';
    } else if (tab === 'comments') {
      this.changeCommentsPage();
      this.currentTab = 'comments';
    }
  }

  changeArtistPage(pageNum) {
    const idsToFetch = this.artistsIds.slice(pageNum * 15, (pageNum + 1) * 15).map(v => v.artist);
    this.ratedArtists = undefined;
    this.spotifyService.getMultipleArtists(idsToFetch.toString())
    .subscribe(artists =>
      // Use promise all to fetch artists colors
      this.ratedArtists = artists.map(artist => {
        const artistJustId = this.artistsIds.find(id => id.artist === artist.id);
        artist.average = artistJustId.average;
        artist.ratings_count = artistJustId.ratings.length;
        return artist;
      })
    );
  }

  changeCommentsPage() {
    if (!this.userComments) {
      this.ratingsService.getUsersComments(this.user.uid).pipe(
        flatMap(comments => this.addReleaseToComments(comments))
      ).subscribe(comments => {
        console.log(comments);
        this.userComments = comments;
      });
    }
  }

  addReleaseToComments(comments: Rating[]) {
    const joinKeys = {};
    const ids = Array.from(new Set(comments)).map(v => v.release_id);
    return this.spotifyService.getMultipleReleases(ids.toString())
      .pipe(map(releases => {
        releases.forEach(release => (joinKeys[(release as Release).id] = release));
        comments = comments.map(v => ({ ...v, release: joinKeys[v.release_id] }));
        return comments;
      }));
  }

  transformRatings(ratings) {
    const eachRank = [];
    ratings.forEach(rating => {
      eachRank.push(rating.data().releases.map(release => {
        return { release, rating: rating.data().rating };
      }));
    });
    const ranks = [].concat.apply([], eachRank);
    const sorted = ranks.slice().sort((a, b) => b.rating - a.rating);
    return this.orderArray(sorted);
  }

  orderArray = (arr) => {
    const tmpArr = Array(arr.length).fill(0).map((_, i) => ({
      value: arr[i],
      order: 1,
    }));
    // Get rid of douplicate values
    const set = new Set(arr.map(v => v.rating));
    // Loops through the set
    for (const a of set) {
      for (const b of tmpArr) {
        // increment the order of an element if a larger element is pressent
        if (b.value.rating < a) {
          b.order += 1;
        }
      }
    }
    return arr.map((v, i) => ({...v, rank: tmpArr[i].order}));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
