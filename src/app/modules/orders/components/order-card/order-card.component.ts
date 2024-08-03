import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Orders } from 'src/app/modules/menu/interfaces/Orders';
import { OrdersService } from '../../services/orders.service';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { UserService } from 'src/app/shared/services/user/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  items = [1, 2, 3]; // Add as many items as needed
  @Input() order: any | undefined;
  @Input() deleteOrderHandler: Function | undefined;
  @Input() updateOrderHandler: Function | undefined;
  @Input() printHundler: Function | undefined;
  currentUser$: Observable<UserInterface | null> | undefined;

  @Output() initiatePayment: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private userService: UserService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  initiatePay(isIniate: boolean, orderId: number) {
    const paymentInfo = {
      isIniate,
      orderId,
    };
    this.initiatePayment.emit(paymentInfo);
  }

  updateOrder(order: Orders | undefined): void {
    if (this.updateOrderHandler && order) {
      // Call the updateOrder method from the parent component
      this.updateOrderHandler(order);
    }
  }
  deleteOrder(orderId: number) {
    if (this.deleteOrderHandler) {
      // Call the deleteOrder method from the parent component
      this.deleteOrderHandler(orderId);
    }
  }
  printOrder(orderId: number) {
    if (this.printHundler) {
      // Call the deleteOrder method from the parent component
      this.printHundler(orderId);
    }
  }

  notification() {
    this.toast.error('You are not authorized to perform this action');
  }
}
