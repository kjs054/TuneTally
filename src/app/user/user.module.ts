import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginSignupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [LoginSignupComponent]
})
export class UserModule { }
