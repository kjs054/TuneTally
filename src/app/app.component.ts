import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { slider, fade, slideIn } from './route-animations';
import { Router, NavigationEnd } from '@angular/router';
import { DynamicColorService } from './services/dynamic-color-service.service';
import { ModalService } from './services/modal.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { RatingService } from './services/rating.service';
import { flatMap } from 'rxjs/operators';
import { ToggleService } from './services/toggle.service';
import { User } from './model/user.model';
import { AuthService } from './services/auth.service';
import { Meta } from '@angular/platform-browser';
import { SpotifyService } from './services/spotify.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slider, fade, slideIn]
})
export class AppComponent implements OnInit {

  currentUser?: User;
  loggedIn = false;
  title = 'music-reviewer';
  menuColor: any;
  prevScrollpos = window.pageYOffset;
  mobile = false;

  constructor(public router: Router,
              public ratingService: RatingService,
              private matIconRegistry: MatIconRegistry,
              public spotifyService: SpotifyService,
              public afAuth: AngularFireAuth,
              private ngZone: NgZone,
              private domSanitizer: DomSanitizer,
              private authService: AuthService,
              public modalService: ModalService,
              private dynamicColorService: DynamicColorService,
              public toggleService: ToggleService,
              private metaTagService: Meta,
              private titleService: Title,
              @Inject(DOCUMENT) private document) {
    router.events.pipe(flatMap(event => {
      if (event instanceof NavigationEnd) {
        this.toggleService.changeSearchToggle(false);
        this.menuColor = '#00CCFB';
        this.router.navigated = false;
        document.getElementById('right-action-menu').style.top = '2.5vh';
        window.scrollTo(0, 0);
      }
      return this.dynamicColorService.palette;
    })).subscribe(palette => {
      switch (this.router.url.split('/')[1]) {
        case 'artist': this.menuColor = palette.Vibrant.getHex(); break;
        case 'profile': this.menuColor = palette.DarkVibrant.getHex(); break;
        case 'release': this.menuColor = 'rgb(0, 0, 0, 0.2)'; break;
      }
    });

    matIconRegistry.addSvgIcon(
      'left_arrow',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/left_arrow.svg')
    );
  }

  ngOnInit() {
    this.document.body.style.background = '#F8F9FE';
    this.titleService.setTitle('TuneTally. Your music, your way.');
    if (window.innerWidth < 1025) {
      this.mobile = true;
    }
    this.metaTagService.updateTag(
      { name: 'apple-mobile-web-app-capable', content: 'yes' }
    );
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.authService.getCurrentUserRatings();
      } else {
        this.currentUser = null;
      }
    });
    window.addEventListener('scroll', this.scroll, true);
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  scroll = (event): void => {
    const element = event.srcElement;
    const sc = element.scrollTop;
    if (sc !== 0 && (element.id === 'content' || element.id === 'results')) {
      this.document.getElementById('right-action-menu').style.top = '-10vh';
    } else {
      this.document.getElementById('right-action-menu').style.top = '2.5vh';
    }
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
    });
  }
}
