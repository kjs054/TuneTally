import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistPageComponent } from './artist-page/artist-page.component';
import { ReleasePageComponent } from './release-page/release-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CallbackComponent } from './callback/callback.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';

const routes: Routes = [
  {path: 'artist/:id', component: ArtistPageComponent, data: {animation: 'isLeft'}},
  {path: 'callback', component: CallbackComponent},
  {path: 'release/:id', component: ReleasePageComponent, data: {animation: 'isLeft'}},
  {path: 'profile/:id', component: ProfilePageComponent},
  {path: '', component: HomePageComponent},
  {path: 'legal', component: PrivacyPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }