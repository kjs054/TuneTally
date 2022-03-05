import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry, MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider'; // RELEASE
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DiscographyResultComponent } from './discography-result/discography-result.component';
import { RatingIndicatorComponent } from './rating-indicator/rating-indicator.component';
import { ArtistBannerComponent } from './artist-banner/artist-banner.component';
import { ResultRowComponent } from './result-row/result-row.component';
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component'; // RELEASE
import { SearchMusicComponent } from './search-music/search-music.component'; // CORE
import { CommentsComponent } from './comments/comments.component'; // RELEASE
import { RouterModule } from '@angular/router';
import { DefaultPipe } from '../pipes/default.pipe';
import { RatingPipe } from '../pipes/rating.pipe';
import { JoinPipe } from '../pipes/join.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { DatePipe } from '../pipes/date.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartComponent } from './chart/chart.component';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { AveragePipe } from '../pipes/average.pipe';
import { BrightnessPipe } from '../pipes/brightness.pipe';
import { AlertComponent } from './alert/alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnalyticsSidebarComponent } from './analytics-sidebar/analytics-sidebar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ArtistResultComponent } from './artist-result/artist-result.component';
import { UserToObjectPipe } from '../pipes/user-to-object.pipe';

const modules = [
  CommonModule,
  MatIconModule,
  MatSliderModule,
  MatDialogModule,
  MatFormFieldModule,
  FormsModule,
  RouterModule,
  BrowserModule,
  ChartModule,
  ToastModule,
  BrowserAnimationsModule,
  NgxSkeletonLoaderModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSelectModule,
  MatMenuModule
];

const pipes = [
  DefaultPipe,
  RatingPipe,
  SafePipe,
  DatePipe,
  AveragePipe,
  BrightnessPipe,
  JoinPipe,
  UserToObjectPipe
];

const components = [
  DiscographyResultComponent,
  RatingIndicatorComponent,
  ResultRowComponent,
  AnalyticsViewComponent,
  SearchMusicComponent,
  ChartComponent,
  CommentsComponent,
  ArtistResultComponent,
  AlertComponent,
  ArtistBannerComponent,
  AnalyticsSidebarComponent
];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [...modules],
  exports: [...components, ...modules, ...pipes],
  providers: [...pipes]
})
export class SharedModule { }
