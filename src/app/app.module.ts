import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppMessageQueueService } from './services/app-message-queue-service.service';
import { DynamicColorService } from './services/dynamic-color-service.service';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserModule } from './user/user.module';
import { RateTrackComponent } from './rate-track/rate-track.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { FooterComponent } from './footer/footer.component';
import { ArtistPageComponent } from './artist-page/artist-page.component';
import { ReleasePageComponent } from './release-page/release-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CallbackComponent } from './callback/callback.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { ReleaseToCommentPipe } from './pipes/release-to-comment.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArtistPageComponent,
    ReleasePageComponent,
    HomePageComponent,
    RateTrackComponent,
    ProfilePageComponent,
    CallbackComponent,
    PrivacyPageComponent,
    FooterComponent,
    ReleaseToCommentPipe,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    UserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
              AppMessageQueueService,
              DynamicColorService,
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true}
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
