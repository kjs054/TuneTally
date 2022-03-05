import { Component, Input, OnChanges, ViewChild, ElementRef, Renderer2, AfterContentInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-rating-indicator',
  templateUrl: './rating-indicator.component.html',
  styleUrls: ['./rating-indicator.component.css']
})
export class RatingIndicatorComponent implements OnChanges, AfterViewInit {

  @ViewChild('scoreHeader', {static: false}) scoreHeader: ElementRef;

  @Input() rating?: number;

  formattedRating: string; // Rating formatted for smaller font-size on decimals

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(): void {
    if (this.scoreHeader) {
      this.renderScore();
    }
  }

  ngAfterViewInit(): void {
    if (this.scoreHeader) {
      this.renderScore();
    }
  }

  renderScore() {
    if (this.rating) {
      this.rating = Number(this.rating.toFixed(1));
      this.formattedRating = this.rating.toString().replace(/(\D*)(\d*\.)(\d*)/, '<span style="font-size:24px;">$2</span><span style="font-size:20px;">$3</span>');
    } else {
      this.formattedRating = '-';
    }
    this.renderer.setProperty(this.scoreHeader.nativeElement, 'innerHTML', this.formattedRating);
  }
}
