import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ShiftService } from '../../../services/shift.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';

@Component({
  selector: 'app-add-petty-cash',
  templateUrl: './add-petty-cash.component.html',
  styleUrls: ['./add-petty-cash.component.scss'],
})
export class AddPettyCashComponent implements OnInit {
  selectedShiftId: any;
  pettyCash: any[] = [];
  PettyPaidWithCash: any[] = [];
  PettyPaidWithMpesa: any[] = [];
  isOpen: boolean = false;
  users: any;
  selectedUser: any;
  selectedUserDetails: any;
  totalPetyCashAmount: number = 0;
  totalPetyCashAmountCash: number = 0;
  totalPetyCashAmountMpesa: number = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;
  shifts: any[] = []; // Array to hold all shifts
  isClicked: boolean = false;

  constructor(
    private adminService: AdminService,
    private toast: HotToastService,
    private shiftService: ShiftService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.subscribeToCurrentShift();
    this.fetchPettyCashForSelectedShift();
    this.getAllUsers();
    this.loadAllShifts();
  }
  createPettyCashForm = {
    spending: '',
    amount: 0,
    madeBy: '',
    paymentMode: '',
    shift_id: '',
  };
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }
  clearForm() {
    this.createPettyCashForm.spending = '';
    this.createPettyCashForm.amount = 0;
    this.createPettyCashForm.madeBy = '';
    this.createPettyCashForm.paymentMode = '';
    this.isClicked = false;
  }
  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      console.log('All shifts', this.shifts);
    });
  }
  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      this.createPettyCashForm.shift_id = this.selectedShiftId;
    });
  }
  getAllUsers() {
    this.userService
      .getAllUsers()
      .then((users: UserInterface[]) => {
        // Handle the list of users here. You can assign it to your component's users property.
        this.users = users;
        console.log('user:', users);
      })
      .catch((error) => {
        // Handle errors if needed.
      });
  }

  onUserSelectionChange() {
    console.log('Selected user ID:', this.selectedUser);
    if (this.selectedUser !== null) {
      const userId = this.selectedUser;
      // You don't need to fetch all users again. The users list is already available in this.users.
      this.selectedUserDetails = this.users.find(
        (user: { id: number }) => user.id === userId
      );
      console.log('user:', this.selectedUserDetails);
    }
  }

  createPettyCash() {
    console.log('Petty Cash:', this.createPettyCashForm);
    this.adminService.createPettyCash(this.createPettyCashForm).subscribe(
      (response) => {
        this.isClicked = true;
        this.toast.success('Petty Cash created successfully:', response);
        this.fetchPettyCashForSelectedShift();
        this.closeModal();
        this.clearForm();
        // Add any additional logic or redirection here
      },
      (error) => {
        this.toast.error('Error creating Petty Cash:', error);
        this.isClicked = false;
        // Handle error as needed
      }
    );
  }

  fetchPettyCashForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.adminService
        .getAllPettyCashForSelectedShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.pettyCash = data.pettyCashList;
          this.PettyPaidWithCash = data.totalCashPaid;
          this.PettyPaidWithMpesa = data.totalMpesaPaid;
          this.totalPetyCashAmountCash = data.totalPettyCash;
          console.log('Petty Cash for the selected shift:', this.pettyCash);
          this.calculateShiftTotalPetyCash();
        });
    }
  }

  calculateShiftTotalPetyCash() {
    // Calculate total sales for the current shift
    this.totalPetyCashAmount = this.pettyCash.reduce((total, petty) => {
      return total + parseFloat(petty.amount);
    }, 0);
    this.totalPetyCashAmountCash = this.PettyPaidWithCash.reduce(
      (total, petty) => {
        return total + parseFloat(petty.amount);
      },
      0
    );
    this.totalPetyCashAmountMpesa = this.PettyPaidWithMpesa.reduce(
      (total, petty) => {
        return total + parseFloat(petty.amount);
      },
      0
    );
    console.log('Total Petty Cash Amount:', this.totalPetyCashAmountCash);
  }

  onShiftSelectionChange() {
    // Fetch orders for the newly selected shift
    this.fetchPettyCashForSelectedShift();
  }

  onDateChange(type: 'start' | 'end', selectedDate: Date | null) {
    console.log(`${type} date selected:`, selectedDate);
    this.searchOrdersByDateTimeRange();

    // You can add any additional logic here based on the selected date
  }

  searchOrdersByDateTimeRange() {
    if (this.selectedShiftId !== null) {
      if (this.startDate && this.endDate) {
        // Adjust startDate to the beginning of the day (00:00:00)
        const adjustedStartDate = new Date(this.startDate);
        adjustedStartDate.setHours(0, 0, 0, 0);

        // Adjust endDate to the end of the day (23:59:59)
        const adjustedEndDate = new Date(this.endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        this.adminService.getAllPettyCash().subscribe((data: any[]) => {
          this.pettyCash = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );
          this.PettyPaidWithCash = this.pettyCash.filter(
            (petty) => petty.paymentMode === 'Cash'
          );
          this.PettyPaidWithMpesa = this.pettyCash.filter(
            (petty) => petty.paymentMode === 'Mpesa'
          );
          console.log(
            'Petty Cash for the selected shift:',
            this.PettyPaidWithCash
          );
          this.calculateShiftTotalPetyCash();
        });
      } else {
        // Fetch orders for the current or selected shift when no date range is provided
        this.fetchPettyCashForSelectedShift();
      }
    }
  }

  isOrderInDateTimeRange(
    order: any,
    startDate: Date | null,
    endDate: Date | null
  ): boolean {
    const orderDateTime = new Date(order.Time);

    if (startDate instanceof Date) {
      if (orderDateTime < startDate) {
        return false;
      }
    }

    if (endDate instanceof Date) {
      // Adjust the endDate to include the full day
      const adjustedEndDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
      if (orderDateTime >= adjustedEndDate) {
        return false;
      }
    }

    return true;
  }
}
