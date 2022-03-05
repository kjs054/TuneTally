import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Release } from '../../model/release.model';
import { RatingService } from 'src/app/services/rating.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Artist } from 'src/app/model/artist.model';

@Component({
  selector: 'app-result-row',
  templateUrl: './result-row.component.html',
  styleUrls: ['./result-row.component.css', '../../home-page/home-page.component.css']
})
export class ResultRowComponent implements OnChanges {

  @Input() data?: { color: string; releases?: Release[], artists?: Artist[], total?: number, type: string};

  constructor(private ratingService: RatingService) {}

  ngOnChanges() {
    if (this.data?.releases) {
      this.getRatingData();
    }
  }

  getRatingData() {
    const docs = this.data.releases.map(release => this.ratingService.getReleaseAverageRating(release.id));
    combineLatest(docs).pipe(map(data => {
      const joinKeys = {};
      data.forEach(v => {
        if (v) {
          joinKeys[v.release_id] = v;
        }
      });
      this.data.releases = this.data.releases.map(release =>
            ({ ...release, rating: joinKeys[release.id]?.rating, ratings_count: joinKeys[release.id]?.count })
      );
    })).subscribe();
  }
}
