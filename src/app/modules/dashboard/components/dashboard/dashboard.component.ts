import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  days: string[] = [];
  selectedDay: string = '';
  shifts: any[] = [];
  @Output() selectedShift = new EventEmitter<string>();
  ShiftsForGraph: any[] = [];
  selectedShiftId: string = ''; // Track the selected shift ID

  constructor(private shiftService: ShiftService) {}

  ngOnInit() {
    this.generateLast10Days();
    this.loadAllShifts();
    this.loadCurrentShift();
  }
  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      this.ShiftsForGraph = data;
    });
  }

  loadCurrentShift() {
    this.shiftService.currentShift$.subscribe((currentShift: any) => {
      if (currentShift) {
        this.selectedShiftId = currentShift.id;
        this.selectedShift.emit(this.selectedShiftId!);
        console.log('emmited current shifts', this.selectedShiftId);
      }
    });
  }
  onShiftSelectionChange() {
    this.selectedShift.emit(this.selectedShiftId!);
  }

  generateLast10Days() {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    for (let i = 0; i < 10; i++) {
      const day = lastDayOfMonth - i;
      const formattedDate = today.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      this.days.push(formattedDate);
    }
  }
}
