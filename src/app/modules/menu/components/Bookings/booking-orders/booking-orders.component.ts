import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-booking-orders',
  templateUrl: './booking-orders.component.html',
  styleUrls: ['./booking-orders.component.scss']
})
export class BookingOrdersComponent implements OnInit {
  // roomSales:any[]=[];
  @Input() roomSales: any | undefined
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private menuService: MenuService,
    private adminservice:AdminService,
    private searchService:SearchService,
    private notificationService:HotToastService,
  ) { }
  ngOnInit() {
  }

  getRoomSales(){
    this.adminservice.getRoomsSales().subscribe((res:any)=>{
      this.roomSales=res.filter((item:any)=>item.deleted==0)
    });
    console.log(this.roomSales)
  }
  deleteOrder(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to Void this order?');
  
    if (isConfirmed) {
      this.adminservice.deleteOrder(id).subscribe((res: any) => {
        this.notificationService.success('Order Voided Successfully');
        this.getRoomSales();
      });
    }
  }

  cancelCreditSale(): void {
    // Emit the cancel event to notify the parent component
    this.onCancel.emit();
  }
  

}
