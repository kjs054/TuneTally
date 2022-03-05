import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../model/artist.model';
import { Release } from '../../model/release.model';
import { AppMessageQueueService } from '../../services/app-message-queue-service.service';
import { slideUpDown, fade } from 'src/app/route-animations';
import { ToggleService } from 'src/app/services/toggle.service';

@Component({
  selector: 'app-search-music',
  templateUrl: './search-music.component.html',
  styleUrls: ['./search-music.component.css'],
  animations: [slideUpDown, fade]
})
export class SearchMusicComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  searchStr: string;
  searchResults: {artists: Artist[], releases: Release[]};
  showingSearchResults = false;

  constructor(private spotifyService: SpotifyService,
              private appMsgService: AppMessageQueueService,
              private toggleService: ToggleService) { }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  searchMusic() {
    this.spotifyService.searchMusic(this.searchStr)
    .subscribe(results => {
      this.searchResults = results;
      // Check if the length of total results is > 0
      this.showingSearchResults = (this.searchResults.artists.length + this.searchResults.releases.length) !== 0;
    });
  }

  closeSearch() {
    // Clear navigation array for releases since search was abandoned
    this.toggleService.changeSearchToggle(false);
    this.appMsgService.clearReleases();
  }

  getResultType(result) {
    return result.type === 'artist' ? 'artist' : 'release';
  }
}
