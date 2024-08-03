import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../services/shift.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
})
export class ShiftsComponent implements OnInit {
  currentShift: any;
  currentUser: any;
  shiftName: string = '';
  shiftStarted: boolean = false;
  isOpen: boolean = false;
  startingCash: string = '';
  startingMpesa: string = '';
  startingBank: string = '';

  constructor(
    private shiftService: ShiftService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
  }

  initializeData(): void {
    this.checkForOpenShift();
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  checkForOpenShift(): void {
    this.shiftService.currentShift$.subscribe((shift) => {
      if (shift) {
        this.shiftName = shift.ShiftName;
        this.shiftStarted = true;
        this.currentShift = shift;
        console.log('Current Shift', this.currentShift);
      } else {
        this.shiftStarted = false;
      }
    });
  }

  startShift(): void {
    const shiftData = {
      shiftName: this.shiftName,
      startedBy: this.currentUser.username,
    };
    this.shiftService.startShift(shiftData);
    this.shiftStarted = true;
    console.log('Shift Started', this.shiftName);
  }

  createNewShift(): void {
    const newShiftData = {
      StartedBy: this.currentUser.username,
      starting_cash: this.startingCash,
      starting_mpesa: this.startingMpesa,
      starting_bank: this.startingBank,
    };

    this.shiftService.startShift(newShiftData).subscribe(
      (createdShift) => {
        console.log('New shift created:', createdShift);
        // Additional actions upon successful creation
        this.closeModal(); // Close the modal after creating the shift
        this.initializeData(); // Reinitialize data after creating a new shift
      },
      (error) => {
        console.error('Error creating shift:', error);
        // Handle errors if creating a new shift fails
      }
    );
  }

  endShift(): void {
    this.shiftService.endShift(this.currentShift.username).subscribe(
      () => {
        // This block will execute on success
        this.initializeData();
        this.shiftName = '';
        this.shiftStarted = false;

        // Reload the current route to reflect the changes
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/shifts']);
      },
      (error) => {
        // This block will execute on error
        console.error('Error ending shift:', error);
        // You may want to handle the error and provide user feedback
      }
    );
  }
}
