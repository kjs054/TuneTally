import { Component, Input, OnChanges } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { Rating } from '../../model/rating.model';
import { slideUpDown } from 'src/app/route-animations';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
type Comments = Array<{ author: string, content: string, rating: number, profileImage: string }>;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  animations: [slideUpDown]
})
export class CommentsComponent {

  @Input() comments: Rating[]; @Input() total: number; @Input() releaseId: string;

  constructor(public authService: AuthService,
              private ratingService: RatingService,
              private alertService: AlertService) { }

  async handleDeletion() {
    const { uid } = await this.authService.getUser();
    this.ratingService.removeComment(this.releaseId).then(() => {
      this.comments = this.comments.filter(v => v.uid !== uid);
      this.alertService.update('positive', 'Comment Deleted');
    });
  }
}
