import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Artist } from '../model/artist.model';
import { map, tap, publishReplay, refCount, retry } from 'rxjs/operators';
import { Release } from '../model/release.model';
import { AlbumType } from '../model/abumType.model';
import { AppMessageQueueService } from './app-message-queue-service.service';
import { throwError, } from 'rxjs';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private cachedReleases: Release[] = [];

  constructor(private appMsgService: AppMessageQueueService, private http: HttpClient, private authService: AuthService) { }

  /* MAKE GENERIC */
  connectSpotify() {
    const url =  environment.backend + 'connect';
    window.location.href = url;
  }

  // Search for artists by query string
  searchMusic(query: string, type = 'track,artist') {
    const url = 'https://api.spotify.com/v1/search?query=' + query + '&offset=0&limit=5&type=' + type + '&market=US';
    return this.http.get<(Release | Artist)[]>(url)
      .pipe(map(res => {
        let artists: Artist[] = res['artists']['items'];
        let releases: any[] = res['tracks']['items'].map(track => {
          const album = track.album;
          album.popularity = track.popularity;
          return album;
        });
        artists = this.cleanupResponse(artists).sort((a, b) => b.popularity - a.popularity).filter(artist => artist.images.length !== 0);
        releases = this.cleanupResponse(releases).sort((a, b) => b.popularity - a.popularity).filter(release => release.images.length !== 0);
        return { artists, releases };
      }));
  }

  // Get specific release data by its ID
  getRelease(releaseId: string) {
    const url = 'https://api.spotify.com/v1/albums/' + releaseId;
    if (!(this.cachedReleases.some(release => release.id === releaseId))) {
      return this.http.get(url)
        .pipe(map(res => {
          const release = res as Release;
          const tracks = res['tracks']['items'];
          release.tracks = tracks;
          return release;
        }), tap(release => this.cachedReleases.push(release)), publishReplay(), refCount());
    }
    return of(this.cachedReleases.find(release => release.id === releaseId));
  }

  getUsersTopTracks(limit, duration) {
    const url = 'https://api.spotify.com/v1/me/top/tracks?limit=' + limit + '&time_range=' + duration;
    return this.http.get(url)
      .pipe(map(res => {
        const items = res['items'];
        if (items.length > 0) {
          return this.cleanupResponse(items.map(v => v.album) as Release[]);
        } else {
          throw throwError('No Results');
        }
      }));
  }

  getUsersTopArtists(limit, duration) {
    const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + limit + '&time_range=' + duration;
    return this.http.get(url)
      .pipe(map(res => {
        const artists = res['items'] as Artist[];
        if (artists.length > 0) {
          return artists;
        } else {
          throw throwError('No results');
        }
      }));
  }

  getUsersRecentlyPlayed(limit) {
    const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=' + limit;
    return this.http.get(url)
      .pipe(map(res => {
        const items = res['items'];
        if (items.length > 0) {
          return this.cleanupResponse(items.map(v => v.track.album) as Release[]);
        } else {
          throw throwError('No results');
        }
      }));
  }

  getMultipleReleases(releasesIds: string) {
    const url = 'https://api.spotify.com/v1/albums?ids=' + releasesIds;
    return this.http.get(url)
      .pipe(map(res => {
        const releases = res['albums'] as Release[];
        return releases;
      }));
  }

  getMultipleArtists(artistsId: string) {
    const url = 'https://api.spotify.com/v1/artists?ids=' + artistsId;
    return this.http.get(url)
      .pipe(map(res => {
        const artists = res['artists'] as Artist[];
        return artists;
      }));
  }

  // Get specific artist data by their ID
  getArtist(artistId: string) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId;
    return this.http.get(url)
      .pipe(map(res => res as Artist));
  }

  // Get all releases for an artist by their ID
  getArtistReleases(artistId: string, type: string, offset = 0, prevTotal?: number) {
    const baseUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/albums?&offset=' + offset + '&market=US&limit=20&include_groups=';
    return this.http.get(baseUrl + type).pipe(map(res => {
      const releases = this.cleanupResponse(res['items']);
      return { releases, total: res['total'], type: AlbumType[type] };
    }));
  }

  // Get the latest releases on spotify to display on home page
  getLatestReleases(limit) {
    const url = 'https://api.spotify.com/v1/browse/new-releases?limit=' + limit;
    return this.http.get<Release[]>(url)
        .pipe(map(res => {
          this.appMsgService.saveReleases(res['albums']['items']);
          return this.cleanupResponse(res['albums']['items']);
        }));
  }

  getReleaseRecommendations(artistId: string, releaseId: string, limit = 4) {
    const url = 'https://api.spotify.com/v1/recommendations?limit=' + limit + '&market=US&seed_artists=' + artistId + '&seed_tracks=' + releaseId + '&min_energy=0.4&min_popularity=50';
    return this.http.get<Release[]>(url)
      .pipe(map(res => this.cleanupResponse(res['tracks'].map(item => item.album))));
  }

  cleanupResponse(response) {
    return response.filter((v, i, a) => a.findIndex(t => this.removeNameDetails(t.name) === this.removeNameDetails(v.name)) === i);
  }

  // Remove details surrounded by parentheses to filter duplicate releases (ex: Album (Remastered) === Album )
  removeNameDetails(name) {
    return name.replace(name.substring(name.lastIndexOf('(') + 1, name.lastIndexOf(')')), '');
  }
}
