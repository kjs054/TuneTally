import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.css']
})
export class AnalyticsViewComponent {

  @Input() ranks: {userRank: number, genreRank: number, worldRank: number};

  constructor(private modalService: ModalService,
              private afAuth: AngularFireAuth,
              private router: Router) { }

  async handleAnalyticElement() {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      this.router.navigate(['/profile', user.uid]);
    } else {
      this.modalService.openLoginDialog();
    }
  }
}
