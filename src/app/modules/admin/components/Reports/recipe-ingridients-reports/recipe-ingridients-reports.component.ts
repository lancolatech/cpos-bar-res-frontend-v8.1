import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-recipe-ingridients-reports',
  templateUrl: './recipe-ingridients-reports.component.html',
  styleUrls: ['./recipe-ingridients-reports.component.scss'],
})
export class RecipeIngridientsReportsComponent implements OnInit {
  reportForm: FormGroup;
  shifts: any[] = [];
  reports: any[] = [];
  totalCost: number = 0;
  estimatedProfit: number = 0;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private shiftService: ShiftService
  ) {
    this.reportForm = this.fb.group({
      reportType: ['shift'],
      shiftId: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    // this.initForm();
    this.loadShifts();
  }

  initForm() {
    this.reportForm = this.fb.group({
      reportType: ['shift'],
      shiftId: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  loadShifts() {
    // Implement method to load shifts
    this.shiftService.getAllShifts().subscribe(
      (shifts: any[]) => {
        this.shifts = shifts;
      },
      (error) => console.error('Error loading shifts:', error)
    );
  }

  onSubmit() {
    const formValue = this.reportForm.value;
    if (formValue.reportType === 'shift') {
      this.getReportForShift(formValue.shiftId);
    } else {
      this.getReportForDateRange(formValue.startDate, formValue.endDate);
    }
  }

  getReportForShift(shiftId: string) {
    this.adminService.getReportForShift(shiftId).subscribe(
      (report: any) => {
        this.processReport(report);
      },
      (error) => console.error('Error fetching shift report:', error)
    );
  }

  getReportForDateRange(startDate: string, endDate: string) {
    this.adminService.getReportForDateRange(startDate, endDate).subscribe(
      (report: any) => {
        this.processReport(report);
      },
      (error) => console.error('Error fetching date range report:', error)
    );
  }

  processReport(report: any) {
    this.reports = report.productionRecords;
    this.totalCost = report.totalCost;
    this.estimatedProfit = report.estimatedProfit;
  }
}
