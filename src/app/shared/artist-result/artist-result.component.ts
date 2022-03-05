import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';
import { Artist } from 'src/app/model/artist.model';

@Component({
  selector: 'app-artist-result',
  templateUrl: './artist-result.component.html',
  styleUrls: ['./artist-result.component.css']
})
export class ArtistResultComponent implements OnChanges {

  @Input() artist?: Artist;

  palette: Palette;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnChanges() {
    if (this.artist) {
      Vibrant.from(this.artist.images[1].url).getPalette().then(palette => {
        this.palette = palette;
        this.renderer.setStyle(this.el.nativeElement, 'background-image', 'linear-gradient(to bottom right, ' + palette.Vibrant.getHex() + ', ' + palette.DarkVibrant.getHex() + ')');
      });
    }
  }
}
