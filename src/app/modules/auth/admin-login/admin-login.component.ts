import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }
  adminLogin(): any {
    let formValues = this.adminLoginForm.value;
    if (this.auth.isLoggedIn) {
      if (formValues) {
        return this.auth.AdminLogin(formValues.email, formValues.password);
      }
    }
    else if (!this.auth.isLoggedIn) {
      console.log(this.auth.isLoggedIn)
      this.router.navigate(['/menu'])
    }
  }
}
