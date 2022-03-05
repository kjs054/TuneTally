import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { Rating } from '../model/rating.model';
import { Release } from '../model/release.model';
import { SpotifyService } from '../services/spotify.service';

@Pipe({
  name: 'releaseToComment'
})
export class ReleaseToCommentPipe implements PipeTransform {

  constructor(private spotifyService: SpotifyService) { }

  transform(comments: Rating[]) {
    const joinKeys = {};
    const ids = Array.from(new Set(comments)).map(v => v.release_id);
    return this.spotifyService.getMultipleReleases(ids.toString())
      .pipe(map(releases => {
        releases.forEach(release => (joinKeys[(release as Release).id] = release));
        Object.keys(comments).forEach(key => {
          comments[key] = comments[key].map(v => ({ ...v, release: joinKeys[v.id] }));
        });
        return comments;
      }));
  }
}
