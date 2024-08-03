import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-order-payment-input',
  templateUrl: './order-payment-input.component.html',
  styleUrls: ['./order-payment-input.component.scss']
})
export class OrderPaymentInputComponent implements AfterViewInit {
  @ViewChild('amountInput') amountInput!: ElementRef;

  ngAfterViewInit() {
    // The element is available in ngAfterViewInit
  }
  constructor(private modalService: ModalService) {}


  openModal(): void {
    this.modalService.toggleModal();
  }

  addToInput(number: number) {
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue + number;
  }
  backspace() {
    // Remove the last character from the input field
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue.slice(0, -1);
  }
}
