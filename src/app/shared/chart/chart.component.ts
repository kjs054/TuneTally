import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Release } from 'src/app/model/release.model';
import { SpotifyService } from 'src/app/services/spotify.service';
import { flatMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  animations: []
})
export class ChartComponent implements OnChanges {

  @Input() ratings: any[];

  // store ranking data for each page (max of 10 at a time)
  currentChart: any[];
  currentPage = 1;
  releases: Release[] = [];
  isLoading: boolean;

  constructor(private spotifyService: SpotifyService) { }

  ngOnChanges(): void {
    // If the ratings data is changed, such as on firebase listen doc change update the chart
    this.paginateChart(0);
  }

  paginateChart(pageNum) {
    const pageResults = this.ratings.slice(pageNum * 10, (pageNum + 1) * 10); // Slice array to get correct values
    const releaseIds = pageResults.map(result => result.release.id); // Only access the ids
    // Remove ids of releases that have been rendered
    const filteredIds = releaseIds.filter(id => !(this.releases.some(release => release.id === id)));
    if (filteredIds.length !== 0) {
      this.getChartItems(pageResults, filteredIds);
    }
    this.currentChart = pageResults;
    this.currentPage = pageNum;
  }

  getChartItems(newPageResults, releaseIds) {
    this.isLoading = true;
    this.spotifyService.getMultipleReleases(releaseIds.join(',')
    ).subscribe(albums => {
      albums.forEach(album => {
        album.rating = newPageResults.find(rank => rank.release.id === album.id).rating;
        // save loaded releases to array to prevent duplicate requests
        this.releases.push(album);
      });
      this.isLoading = false;
    }, take(1));
  }

  get numberOfPages() {
    const num = Math.ceil(this.ratings.length / 10);
    return Array(num).fill(1).map(( x, i ) => i + 1);
  }

  getArtistsNames(release) {
    return release.artists.map(v => v.name);
  }

  findRelease(id) {
    // Find release data in the release array
    return this.releases.find(release => release.id === id);
  }
}
