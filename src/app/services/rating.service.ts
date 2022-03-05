import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Rating } from '../model/rating.model';
import Timestamp = firestore.Timestamp;
import { AlertService } from './alert.service';
import { firestore } from 'firebase/app';
import { Release } from '../model/release.model';
import { AuthService } from './auth.service';
import FieldValue = firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
/* Handles the getting and poting of rating related data to firestore */
export class RatingService {

  userRatings: Rating[];
  constructor(private db: AngularFirestore,
              private alertService: AlertService,
              private authService: AuthService) {}

  async addRating(release: Release, rating?: number, priorRating?: number, comment?: string, isTrack = false) {
    const { uid } = await this.authService.getUser();
    // Check if the user posted an invalid rating
    if (!rating && !comment) {
      this.alertService.update('negative', 'Rating must be above 0');
      return Promise.reject(new Error('Rating cant be 0'));
    }
    // Check if the release is a track so we don't add it to their chart rankings
    if (rating) {
      this.addRankingData(uid, release, rating, priorRating, isTrack);
    }
    return this.db.collection('ratings').doc(uid + '_' + release.id).set({
      ...rating && { rating },
      comment: comment ? comment : '',
      release_id: release.id,
      uid,
      posted: Timestamp.fromDate(new Date())
    }, { merge: true }).then(() => this.alertService.update('positive', priorRating ? `Rating has been updated for '${release.name}'` : `Rating has been added to '${release.name}'`));
  }

  async removeRating(release: Release, priorRating: number) {
    const { uid } = await this.authService.getUser();
    this.db.collection('ratings').doc(uid + '_' + release.id).update({rating: FieldValue.delete()});
    this.resetRankingData(uid, release, priorRating, false);
  }

  addRankingData(uid, release: Release, rating, priorRating, isTrack = false) {
    let ref: AngularFirestoreCollection;
    let date;
    if (isTrack) {
      ref = this.db.collection('users').doc(uid).collection('track_ratings');
    } else {
      ref = this.db.collection('users').doc(uid).collection('ratings');
    }
    if (priorRating) {
      // If a user previously set a rating we want to remove it first and recalculate the average rating
      this.resetRankingData(uid, release, priorRating, isTrack);
    }
    if (release.release_date) {
      date = Timestamp.fromDate(new Date(release.release_date));
    }
    return ref.doc(rating.toString()).set({
      count: firestore.FieldValue.increment(1),
      rating,
      releases: firestore.FieldValue.arrayUnion(
        {id: release.id, artists: release.artists.map(v => v.id), ...date  && { date } }
      )
    }, { merge: true });
  }

  resetRankingData(uid, release, rating, isTrack = false) {
    let ref;
    let date;
    if (isTrack) {
      ref = this.db.collection('users').doc(uid).collection('track_ratings');
    } else {
      ref = this.db.collection('users').doc(uid).collection('ratings');
    }
    if (release.release_date) {
      date = Timestamp.fromDate(new Date(release.release_date));
    }
    ref.doc(rating.toString()).set({
      count: firestore.FieldValue.increment(-1),
      rating,
      releases: firestore.FieldValue.arrayRemove(
        { id: release.id, artists: release.artists.map(v => v.id), ...date  && { date } }
      )
    }, { merge: true });
  }

  getUsersComments(uid) {
    return this.db.collection('ratings', ref => ref.where('uid', '==', uid).where('comment', '!=', '').orderBy('comment')
    .orderBy('posted', 'desc').limit(5)).get().pipe(map(docs => docs.docs.map(v => v.data())));
  }

  getRecentlyRated(limit) {
    return this.db.collection('ratings', ref => {
      return ref.orderBy('posted', 'desc').limit(limit);
    }).get().pipe(map(docs => {
      const data = docs.docs.map(doc => doc.data()) as Rating[];
      const result = data.reduce((arr, item) => {
        const exists = !!arr.find(x => x.release_id === item.release_id);
        if (!exists){
            arr.push(item);
        }
        return arr;
      }, []);
      return result;
    }));
  }

  async removeComment(releaseId: string) {
    const { uid } = await this.authService.getUser();
    return this.db.collection('ratings').doc(uid + '_' + releaseId).set({comment: ''}, {merge: true});
  }


  // Get the users rating
  getUserRating(releaseId) {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.db.collection('ratings').doc(user.uid + '_' + releaseId).get().pipe(map(data => data.data()));
        } else {
          return [];
        }
      })
    );
  }

  getUsersReleaseRank(rating: number) {
    return this.authService.ratings.pipe(map(docs => {
      const higherRatings = docs.filter(data => data.data().rating > rating);
      return higherRatings.map(item => item.data().count).reduce((a, b) => a + b, 0) + 1;
    }));
  }

  getReleaseComments(releaseId) {
    return this.db.collection('ratings', ref => ref.where('release_id', '==', releaseId).where('comment', '!=', '').orderBy('comment')
    .orderBy('posted', 'desc').limit(5)).snapshotChanges().pipe(
      map(docs => docs.map(v => v.payload.doc.data()))
    );
  }

  getReleaseRatings(releaseId) {
    return this.db.collection('ratings', ref => ref.where('release_id', '==', releaseId)
      .orderBy('posted', 'desc').limit(5)).snapshotChanges().pipe(
        map(docs => docs.map(v => v.payload.doc.data())));
  }

  getReleaseAverageRating(releaseId) {
    return this.db.collection('releases').doc(releaseId).get().pipe(map(doc => doc.data()));
  }
}
