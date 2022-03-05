import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingService } from '../services/rating.service';
import { MatSliderChange } from '@angular/material/slider';
import { Release } from '../model/release.model';

@Component({
  selector: 'app-rate-track',
  templateUrl: './rate-track.component.html',
  styleUrls: ['./rate-track.component.css']
})
export class RateTrackComponent implements OnInit {

  track: Release;
  color: string;
  sliderValue = 0;
  priorRating;

  constructor(private ratingService: RatingService,
              public dialogRef: MatDialogRef<RateTrackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.color = data.color;
    this.track = data.track;
  }

  ngOnInit(): void {
    this.ratingService.getUserRating(this.track.id).subscribe(({ rating }) => {
      if (rating) {
        this.priorRating = rating;
      }
    });
  }

  onInputChange(event: MatSliderChange) {
    this.sliderValue = event.value;
  }

  addRatingHandler() {
    this.ratingService.addRating(this.track, this.sliderValue, this.priorRating, undefined, true)
    .then(done => this.dialogRef.close({rating: this.sliderValue}))
    .catch(error => console.log(error));
  }
}
