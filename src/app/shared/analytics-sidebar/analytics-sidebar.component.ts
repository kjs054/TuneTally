import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Rating } from 'src/app/model/rating.model';
import { Release } from 'src/app/model/release.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics-sidebar',
  templateUrl: './analytics-sidebar.component.html',
  styleUrls: ['./analytics-sidebar.component.css']
})
export class AnalyticsSidebarComponent implements OnChanges {

  @Input() ratings?: any[]; @Input() totalReleases?: number; @Input() mainColor;

  ratingsAverage: number;

  decadeData: any;
  ratingsData: any;

  chartOptions = {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true,
          precision: 0
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontSize: 18
        }
      }]
    },
    legend: {
      display: false
    },
  };

  constructor(public router: Router) { }

  ngOnChanges(): void {
    if (this.ratings) {
      const sum = this.ratings.reduce((s, { rating }) => s + rating, 0);
      this.ratingsAverage = Number((sum / this.ratings.length).toFixed(2)) || 0;
      this.setGraphData();
    }
  }

  setGraphData() {
    // Set decade chart
    if (this.router.url.includes('/profile')) {
      this.decadeData = {
        labels: this.filteredByDecade.map(item => item.decade),
        datasets: [
          {
            backgroundColor: this.mainColor,
            borderColor: '#1E88E5',
            data: this.filteredByDecade.map(item => item.count)
          },
        ]
      };
    }
    // Set ratings distribution chart
    this.ratingsData = {
      labels: this.filteredRatingsData.map(item => item.rating),
    datasets: [
      {
        backgroundColor: this.mainColor,
        borderColor: '#1E88E5',
        data: this.filteredRatingsData.map(item => item.count)
      },
    ]
    };
  }

  get filteredByDecade() {
    const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const decadesData = decades.map(decade => ({decade, count: 0}));
    this.ratings.map(item => {
      const date = new Date(item.release.date.toDate());
      const floorDecade = (date.getFullYear() -  date.getFullYear() % 10);
      const matchedDecade = decadesData.find(decadeData => decadeData.decade === floorDecade);
      matchedDecade.count =  matchedDecade.count + 1;
    });
    return decadesData.map(item => ({ decade: item.decade + 's', count: item.count }));
  }

  get filteredRatingsData() {
    const possibleRatings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
    const ratingsData = possibleRatings.map(rating => ({rating, count: 0}));
    this.ratings.map(item => {
      const matchedRating = ratingsData.find(ratingData => ratingData.rating === item.rating);
      matchedRating.count =  matchedRating.count + 1;
    });
    return ratingsData;
  }

}
