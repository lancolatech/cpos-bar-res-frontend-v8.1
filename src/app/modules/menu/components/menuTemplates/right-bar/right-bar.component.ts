import { Component, EventEmitter, Input, Output } from '@angular/core';
import { menuItem } from '../../../interfaces/menuItems.interface';
import { CommonModule } from '@angular/common';
import { posOrder } from '../../../interfaces/order.interface';

@Component({
  selector: 'app-right-bar',
  standalone: true,
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss'],
  imports: [CommonModule]
})
export class RightBarComponent {
  @Input() receiptItems:menuItem [] =[];
  @Input() total:number | undefined;
  @Input() subTotal:number | undefined;
  @Output() orderToPlace: EventEmitter<posOrder> = new EventEmitter();

  placeOrder(){
    type itemToAddInOrder = Pick<menuItem, 'product_no' | 'orderCount' | 'special_price' | 'description'>
    const items:menuItem[] = this.receiptItems.filter((item) => item.orderCount > 0)
    const itemsToAdd:itemToAddInOrder[] = []
  items.forEach((item:menuItem) =>{
    const itemToAdd:itemToAddInOrder = {
      product_no: item.product_no,
      orderCount: item.orderCount,
      special_price: item.special_price,
      description:item.description,
    }
    const formatedItem:any ={
      'product_no':itemToAdd.product_no,
      'quantity': itemToAdd.orderCount,
      'charge':itemToAdd.special_price,
      'uom':'',
      'item_discount':'0.0'
    }
    itemsToAdd.push(formatedItem)
  })
  console.log(itemsToAdd)
    const temp_id = Math.random().toString(36).substring(2,7);

    const order:posOrder ={
      tx_type: 'ORDER',
      pos_user: 'admin',
      currency: '',
      payment_mode: '',
      customer_no: '',
      temp_id: temp_id,
      date_issued: '',
      discount: 0,
      amount_tendered: '',
      original_txn_no: '',
      dest_branch: '',
      orig_branch: '',
      supplierinvoiceno: '',
      lpolsonumber: '',
      tx_description: '',
      tx_instructions: '4',
      tx_customer_message: '',
      date_due: '',
      tax_percentage: '',
      catering_levy_rate: '',
      items: itemsToAdd
    }
    this.orderToPlace.emit(order)
  }


  // Initialize the showDeleteIcon property for each receiptItem
  ngOnInit() {
    this.receiptItems.forEach(item => (item.showDeleteIcon = false));
  }

  deleteItem(receiptItem: any) {

    receiptItem.orderCount=0
  }
}
