import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedInn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logoutUser(): void {
    this.authService.logout();
    console.log('user loged out');
  }
}
