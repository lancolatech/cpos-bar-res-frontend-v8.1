import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { Shift } from 'src/app/modules/menu/interfaces/Shift';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-graph-card',
  templateUrl: './graph-card.component.html',
  styleUrls: ['./graph-card.component.scss']
})
export class GraphCardComponent implements OnInit {
  shifts:Shift[]=[];
  last7ShiftsData: any[] = [];
  constructor(private shiftService:ShiftService,private menuService:MenuService, private changeDetectorRef: ChangeDetectorRef){}
  ngOnInit(): void {
    this.loadAllShifts();
    // this.getLast7ShiftsData();
    this.updateChartWithData()
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data;
      console.log('Shifts for the graph', this.shifts);
  
      this.getLast7ShiftsData(); // Call getLast7ShiftsData() here
    });
  }
  generateRandomData(): number[] {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push(Math.floor(Math.random() * 500) + 100);
    }
    return data;
  }
  getLast7ShiftsData() {
    const last7Shifts = this.shifts.slice(-7); // Get the last 7 shifts from the end of the array
  
    // Fetch all orders
    this.menuService.getPostedOrders().subscribe((orders: any[]) => {
      last7Shifts.forEach((shift: Shift) => {
        const ordersInShift = orders.filter((order) => order.ShiftID === shift.id);
  
        // Calculate complete orders for each shift
        const completeOrdersCount = ordersInShift.filter((order) => order.Is_complete).length;
  
        // Use completeOrdersCount as data for the shift
        this.last7ShiftsData.push({
          label: `${shift.ShiftName}`,
          y: completeOrdersCount,
        });
      });
  
      this.updateChartWithData(); // Update chart data
      this.changeDetectorRef.detectChanges(); // Force UI update
    });
  }
  
  
  
  

  updateChartWithData() {

    console.log('X data:', this.last7ShiftsData.map(dataPoint => dataPoint.label));
    console.log('Y data:', this.last7ShiftsData.map(dataPoint => dataPoint.y));
    // Update chart dataPoints with the last 7 shifts data
    this.chartOptions.data[0].dataPoints = this.last7ShiftsData;

    // Trigger chart update after updating the data
    // Call your chart update logic here to reflect the changes in the UI
  }



  chartOptions = {
    title: {
      text: "Complete Orders",
      fontColor: "#FFFFFF",
    },
    theme: "light2",
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
      valueFormatString: "#,##0k",
      labelFontColor: "#FFFFFF",
    },
    data: [{
      type: "column",
      yValueFormatString: "#,##0",
      color: "#C2DBE9",
      dataPoints: this.last7ShiftsData, // Use last7ShiftsData directly
      borderColor: "#C2DBE9",
      borderWidth: 1,
    }],
    backgroundColor: "#111315",
  };
  

}
