import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    ResetPasswordComponent,
    LoginComponent,
    AdminLoginComponent,
    // LogoutComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class AuthModule { }
