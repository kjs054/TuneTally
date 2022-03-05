import { Component, Inject, OnInit } from '@angular/core';
import { Release } from '../model/release.model';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Artist } from '../model/artist.model';
import Vibrant from 'node-vibrant';
import { DynamicColorService } from '../services/dynamic-color-service.service';
import { AlbumType } from '../model/abumType.model';
import { flatMap, map } from 'rxjs/operators';
import { Subscription, forkJoin, combineLatest } from 'rxjs';
import { AppMessageQueueService } from '../services/app-message-queue-service.service';
import { RatingService } from '../services/rating.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})

export class ArtistPageComponent implements OnInit {

  showSearch = false;
  artist?: Artist;
  releases: { type: AlbumType, releases: Release[], total: number }[] = [];
  showSearchBar = true;
  darkVibrantColor: string;
  vibrantColor: string;
  isMobile: boolean;
  accessToken: string;
  subscriptions: Subscription;
  loaded: boolean;

  constructor(private dynamicColorService: DynamicColorService,
              private spotifyService: SpotifyService,
              private route: ActivatedRoute,
              private appMsgService: AppMessageQueueService,
              private ratingService: RatingService,
              private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Loading...');
    this.loaded = false;
    this.spotifyService.getArtist(this.route.snapshot.params.id).pipe(
      flatMap(artist => {
        this.artist = artist;
        this.titleService.setTitle(this.artist.name);
        const types = Object.keys(AlbumType);
        const requests = types.map(type => this.spotifyService.getArtistReleases(this.route.snapshot.params.id, type));
        return combineLatest(requests);
      }))
      .subscribe(results => {
        const filtered = results.filter(item => item.releases.length !== 0);
        this.releases = filtered;
        this.setAllReleasesForNavigation();
        this.setColors();
        this.loaded = true;
      });
  }

  setColors() {
    Vibrant.from(this.artist.images[0].url).getPalette((err, palette) => {
      this.vibrantColor = palette.Vibrant.getHex();
      this.darkVibrantColor = palette.DarkVibrant.getHex();
      this.dynamicColorService.update(palette);
    });
  }

  pageChangeEvent(event, type) {
    const currentPage = event.pageIndex;
    const matched = this.releases.find(release => release.type === type);
    this.spotifyService.getArtistReleases(
      this.route.snapshot.params.id, type, currentPage * 20, matched.total).subscribe(results => {
        matched.releases = results.releases;
        this.setAllReleasesForNavigation();
      }
    );
  }

  setAllReleasesForNavigation() {
    const allReleases = this.releases.map(v => v.releases).reduce((a, v) => a.concat(v), []) as Release[];
    this.appMsgService.saveReleases(allReleases);
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }
}
