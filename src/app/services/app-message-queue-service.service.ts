import { Injectable } from '@angular/core';
import { Release } from '../model/release.model';

@Injectable()

export class AppMessageQueueService {

    releaseIds: Array<Release> = [];
    constructor() {

    }

    saveReleases(releaseIds: any) {
        this.releaseIds = releaseIds;
    }

    retrieveReleases() {
        return this.releaseIds;
    }

    clearReleases() {
      this.releaseIds = [];
    }

    navigateReleases(direction, currentId) {
    const artistReleases = this.retrieveReleases();
    const itemIndex = artistReleases.map(release => release.id).indexOf(currentId);
    switch (direction) {
      case 'next':
        if (itemIndex === artistReleases.length - 1) {
            return  artistReleases[0];
        } else {
          return artistReleases[itemIndex + 1];
        }
        break;
      case 'prev':
        if (itemIndex === 0) {
          return artistReleases[artistReleases.length - 1];
        } else {
          return artistReleases[itemIndex - 1];
        }
        break;
    }
    }
}
