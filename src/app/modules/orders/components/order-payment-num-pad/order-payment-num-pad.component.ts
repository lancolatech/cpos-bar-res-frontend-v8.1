import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-payment-num-pad',
  templateUrl: './order-payment-num-pad.component.html',
  styleUrls: ['./order-payment-num-pad.component.scss']
})
export class OrderPaymentNumPadComponent {
  @Output() inputChanged = new EventEmitter<string>();

  appendToInput(number: number): void {
    this.inputChanged.emit(number.toString());
  }

  backspace(): void {
    this.inputChanged.emit('backspace');
  }
}
