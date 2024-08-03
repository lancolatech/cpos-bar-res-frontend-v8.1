import { ViewUsersComponent } from './components/view-users/view-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSingleUserComponent } from './components/view-single-user/view-single-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full'
  },
  {
    path: 'view',
    component: ViewUsersComponent,
  },
  {
    path: 'view/:id',
    component: ViewSingleUserComponent,
  },
  {
    path: 'register',
    component: RegisterUserComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
