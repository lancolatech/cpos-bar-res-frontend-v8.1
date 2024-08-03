import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { ViewSingleUserComponent } from './components/view-single-user/view-single-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ViewUsersComponent,
    ViewSingleUserComponent,
    RegisterUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
