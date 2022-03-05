import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  background;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(event =>
           {
            switch (this.router.url.split('/')[1]) {
              case 'artist': this.background = 'linear-gradient(#09c9f7, #048ce9);'; break;
              case 'profile': this.background = 'linear-gradient(#09c9f7, #048ce9);'; break;
              case 'release': this.background = '#0000001f'; break;
            }
           });
    }
}
