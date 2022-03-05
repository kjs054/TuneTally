import { Component, OnInit, Input, Renderer2, OnChanges } from '@angular/core';

@Component({
  selector: 'app-artist-banner',
  templateUrl: './artist-banner.component.html',
  styleUrls: ['./artist-banner.component.css']
})
export class ArtistBannerComponent implements OnChanges {

  @Input() data: { name: string; image: string, colors: { vibrant: string, darkVibrant: string } };

  constructor(private renderer: Renderer2) { }

  ngOnChanges() {
    if (this.data.name) {
      this.draw(this.data.name);
    }
  }

  async draw(txt) {
    const b = document.createElement('canvas');
    b.width = 800;
    b.height = 1600;
    await this.prepareFontLoad(['55px Vanguard-Demi-Bold']);
    const txtHeight = 55;
    const c = b.getContext('2d');
    c.font = txtHeight + 'px Vanguard-Demi-Bold';
    c.fillStyle = 'rgba(255,255,255,0.2)';
    const metric = c.measureText(txt).width;
    const offset = metric / 2;
    const w = Math.ceil(metric);
    c.translate(-500, -450);
    c.rotate(25 * Math.PI / 180);
    txt = new Array(w * 2).join(txt + ' ');
    for (let i = 0; i < Math.ceil(b.height / txtHeight); i++) {
      c.fillText(txt, -(i * offset), i * txtHeight);
    }
    const banner: HTMLElement = document.getElementById('artist-banner-content');
    this.renderer.setStyle(banner, 'background-image', `url(${b.toDataURL('image/png')}), linear-gradient(${this.data.colors.vibrant}, ${this.data.colors.darkVibrant})`);
  }

  prepareFontLoad = (fontList) => Promise.all(fontList.map(font => (document as any).fonts.load(font)));
}
