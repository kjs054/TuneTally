import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import {Release} from '../../model/release.model';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-discography-result',
  templateUrl: './discography-result.component.html',
  styleUrls: ['./discography-result.component.css']
})
export class DiscographyResultComponent {

  @Input() release?: Release;
  name;


  constructor(private ratingService: RatingService) {}
}
