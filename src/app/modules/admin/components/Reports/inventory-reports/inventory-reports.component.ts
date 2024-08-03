import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from '../../../services/shift.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss'],
})
export class InventoryReportsComponent implements AfterViewInit {
  inventory: any[] = [];
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: string = ''; // Track the selected shift ID
  currentShift: any; // Update the type based on your Shift interface or model
  shiftName: any;
  timeStarted: any;
  startDate: Date | null = null;
  endDate: Date | null = null;
  supplierName: string = '';
  surpliers: any[] = [];
  loeading: boolean = true;
  isShiftReports: boolean = true;

  totalPaid: number = 0;
  @ViewChild('reportTemplate', { static: false }) reportTemplate!: ElementRef;
  shiftReportData: any;
  constructor(
    private shiftService: ShiftService,
    private adminService: AdminService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    // this.shiftService.currentShift$.subscribe((shift) => {
    //   this.currentShift = shift;
    //   if (this.currentShift) {
    //     this.fetchOrdersForCurrentShift();
    //   }
    // });

    this.loadAllShifts();
    this.subscribeToCurrentShift();
    this.getAllSurpliers();
  }
  ngAfterViewInit() {
    // if (this.reportTemplate) {
    //   this.generatePDF();
    // } else {
    //   console.error('reportContent not available.');
    // }
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      // console.log('All shifts', this.shifts);
    });
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.currentShift = shift;
      console.log('current shift', this.currentShift);
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      this.shiftName = shift?.ShiftName;
      this.timeStarted = shift?.startTime;
      if (this.selectedShiftId !== null) {
        this.fetchInventoryForSelectedShift();
      }
    });
  }
  getAllSurpliers() {
    this.adminService.getSuppliers().subscribe((data: any) => {
      this.surpliers = data;
      console.log('serpliers', this.surpliers);
    });
  }

  fetchInventoryForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.adminService
        .gettPurchaseOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.inventory = data.purchase;

          this.totalPaid = data.totalPurchase;
          this.loeading = false;
        });
    }
  }
  fetchInventoryForSupplierShift() {
    this.loeading = true;
    if (this.supplierName !== '') {
      this.adminService
        .gettPurchaseOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.inventory = data.purchase.filter(
            (item: any) => item.supplier === this.supplierName
          );
          // console.log('Inventory for the selected shift:', this.inventory);

          this.totalPaid = this.inventory.reduce((acc: number, item: any) => {
            // Parse item.total as a number before adding it to the accumulator
            return acc + parseFloat(item.total);
          }, 0);
          this.loeading = false;
        });
    }
  }
  fetchInventoryForSelectedRange(startDate: Date, endDate: Date) {
    if (this.startDate && this.endDate) {
      this.loeading = true;
      if (this.selectedShiftId !== null) {
        this.adminService
          .gettPurchaseOrdersForSelectedTimeRange(startDate, endDate)
          .subscribe((data: any) => {
            this.isShiftReports = false;
            this.loeading = false;
            this.shiftReportData = data;
            console.log('Data for the shift', this.shiftReportData);
          });
      }
    }
  }

  onDateChange(type: 'start' | 'end', selectedDate: Date | null) {
    // console.log(`${type} date selected:`, selectedDate);
    this.selectedShiftId = '';
    if (selectedDate) {
      // Parse the selected date string into a Date object
      const date = new Date(selectedDate);

      // Strip the time part from the selected date
      date.setHours(0, 0, 0, 0);

      // if (type === 'start') {
      //   this.startDate = date;
      // } else if (type === 'end') {
      //   this.endDate = date;
      // }

      this.fetchInventoryForSelectedRange(this.startDate!, this.endDate!);
    }
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

        // Filter orders based on shift, date, and time range

        this.menuService.getInventory().subscribe((data: any) => {
          if (Array.isArray(data?.inventory)) {
            this.inventory = data.inventory.filter(
              (order: { deleted: any }) =>
                !order.deleted &&
                this.isOrderInDateTimeRange(
                  order,
                  adjustedStartDate,
                  adjustedEndDate
                )
            );
            console.log('Inventory for the selected shift:', this.inventory);

            // Calculate total paid
            this.totalPaid = this.inventory.reduce(
              (total: number, item: any) => {
                const productTotal =
                  item.product_quantity_added * parseFloat(item.buying_price); // Calculate total for each item
                return total + productTotal; // Accumulate total for all items
              },
              0
            );

            console.log('Total Paid:', this.totalPaid);
          } else {
            console.error(
              'Inventory data is not in the expected format:',
              data
            );
            // Handle the situation where the data format is unexpected
          }
        });
      } else {
        // Fetch orders for the current or selected shift when no date range is provided
        this.fetchInventoryForSelectedShift();
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

  onShiftSelectionChange() {
    this.loeading = true;
    this.startDate = null;
    this.endDate = null;
    this.fetchInventoryForSelectedShift();
  }
  onSupplierSelectionChange() {
    this.startDate = null;
    this.loeading = true;
    this.endDate = null;
    this.fetchInventoryForSupplierShift();
  }

  // Function to generate PDF
  generatePDF() {
    const pdf = new jsPDF();

    const options = {
      scale: 3, // Adjust scale if needed for better quality
    };

    const reportContent = this.reportTemplate.nativeElement;

    html2canvas(reportContent, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 size
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('inventory_report.pdf');
    });
  }

  printReport() {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Store Purchases Report</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 20px;
              }
  
              .container {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
  
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
  
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
  
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
  
              th {
                background-color: #f2f2f2;
              }
  
              .footer {
                margin-top: 20px;
                text-align: center;
                font-style: italic;
                color: #555;
              }
            </style>
          </head>
  
          
  
              <h2>Added Items To the Store</h2>
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Purchased By</th>
                    <th>Supplier</th>
                    <th>Quantity</th>
                    <th>B.Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.inventory
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.item}</td>
                      <td>${item.purchased_by}</td>
                      <td>${item.supplier}</td>
                      <td>${item.quantity}</td>
                      <td>Ksh. ${item.buying_price}</td>
                      <td>Ksh. ${item.buying_price * item.quantity}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
  
              <div class="footer">
                Inventory purchases Rerport Generated On ${new Date().toLocaleDateString()}
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();

      // Optionally wait for a short delay to ensure the content is rendered
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      // Handle the case where the print window couldn't be opened
      console.error('Error opening print window');
    }
  }
}
