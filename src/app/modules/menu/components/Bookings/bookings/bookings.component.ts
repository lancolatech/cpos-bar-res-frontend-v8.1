import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { Subscription } from 'rxjs';
import { Category } from '../../../interfaces/category';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { product } from '../../../interfaces/products';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent {
  isOpen = false;
  roomNumber: any;
  isPlaceOrderModalOpen = false;
  isRoomSalesModalOpen = false;
  isPaymentOpen = false;
  rooms: any[] = [];
  roomsBookings: any[] = [];
  newRoomBooking = {
    room_number: '',
    cost_per_day: 0,
    customer_name: '',
    phone: '',
    checkin_date: '',
  };
  roomTotalOrdersCost: number = 0;

  categories: Category[] = [];
  filteredProducts: product[] = [];
  selectedProducts: product[] = [];
  products: any[] = [];
  query: any;
  productTotals: number[] = [];
  roomSales: any[] = [];
  selectedBooking: any;
  selectedShiftId: any;

  takeOutSales: any[] = [];
  selectedOrderDetails: any = {};
  totalAmounts: number[] = [];
  CurrentOrgName: any;
  currentOrganization: OrganizationInterface | null = null;
  daySpent: number = 0;
  cashAmount: any = 0;
  mpesaAmount: any = 0;
  bankAmount: any = 0;
  voucherAmount: any = 0;
  compilmentaryAmount: any = 0;
  receivedAmount: any;
  confirmationCode: any;
  balance: any;
  mpesaConfirmationCode: any;
  bankConfirmationCode: any;
  VoucherCode: any;
  complimentaryOf: any;
  currentShiftId: any;
  loggedinUser: any;
  selectedInputField: string = '';
  advancedOrderId: number | null = null;
  creditSaleIdToBePaid: number | null = null;
  activeTab: string = 'input';
  paymentMode: string = 'Cash';
  selectedPaymentMode: string = 'cash';
  orderId: number | null = null;
  @ViewChild('amountInput') amountInput!: ElementRef;

  private searchQuerySubscription: Subscription | undefined;
  constructor(
    private menuService: MenuService,
    private adminservice: AdminService,
    private searchService: SearchService,
    private shiftService: ShiftService,
    private notificationService: HotToastService
  ) {}
  ngOnInit() {
    this.getAllRooms();
    this.getAllBookings();
    this.getAllProducts();
    this.subscribeToCurrentShift();
  }

  getAllRooms() {
    this.adminservice.getRooms().subscribe((response: any) => {
      this.rooms = response.filter((room: any) => room.available);
      console.log(response);
    });
  }
  updateNewRoomBooking() {
    // Find the selected room based on room_number
    const selectedRoom = this.rooms.find(
      (room) => room.room_number === this.roomNumber
    );
    console.log('selected room details', selectedRoom);

    // Update newRoomBooking with the selected room's details
    if (selectedRoom) {
      this.newRoomBooking.cost_per_day = parseFloat(selectedRoom.cost_per_day);
      this.newRoomBooking.room_number = selectedRoom.room_number;
      console.log(
        'updateNewRoomBooking called',
        this.newRoomBooking.cost_per_day
      );
    }
  }

  submitRoomBooking() {
    console.log(this.newRoomBooking);
    this.adminservice
      .createRoomsBooking(this.newRoomBooking)
      .subscribe((response: any) => {
        this.notificationService.success('Room Booking Created Successfully');
        this.markRoomOcupied(this.newRoomBooking.room_number);
        this.newRoomBooking = {
          room_number: '',
          cost_per_day: 1000,
          customer_name: '',
          phone: '',
          checkin_date: '',
        };
      });
    this.getAllBookings();
    this.closeModal();
  }

  getAllBookings() {
    this.adminservice.getRoomsBookings().subscribe((response: any) => {
      this.roomsBookings = response.filter(
        (sale: any) => !sale.deleted && !sale.is_complete
      );
      console.log(response);
    });
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data.map((category: any) => ({
        ...category,
        products: category.products
          .filter((product: any) => !product.deleted)
          .map((product: any) => ({
            ...product,
            specification: JSON.parse(product.specification), // Parse the specification string into an array
          })),
      }));
      // console.log('Categories', this.categories);
      this.categories.forEach((category) => {
        category.num_products = category.products.length;
      });
    });
  }

  filterCategories() {
    if (this.query.trim() === '') {
      this.loadCategoriesAndSetFirstCategory(); // Load all categories if the query is empty
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.menuService.getCategories().subscribe((data: any) => {
        this.categories = data
          .map((category: any) => ({
            ...category,
            products: category.products
              .filter((product: any) =>
                product.product_name.toLowerCase().includes(lowercaseQuery)
              )
              .filter((product: any) => !product.deleted),
          }))
          .filter(
            (category: any) =>
              category.category_name.toLowerCase().includes(lowercaseQuery) ||
              category.products.length > 0 // Filter categories with matching products
          );
        // console.log('Filtered Categories', this.categories);
      });
    }
  }
  getAllProducts() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      if (this.query) {
        this.filteredProducts = data.filter((product: any) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        );
      } else {
        this.filteredProducts = data.filter((product: any) => !product.is_service);
      }
    });
  }

  subscribeToSearchQueryChanges() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query;
        console.log('Search input changed:', this.query);
        this.loadCategoriesAndSetFirstCategory(); // Trigger reloading categories based on the new search query
      }
    );
  }
  onSearchInputChange() {
    this.filterCategories();
  }
  unsubscribeFromSearchQueryChanges() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  onInputChange() {
    if (this.query) {
      this.filteredProducts = this.categories.flatMap((category) =>
        category.products.filter((product) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        )
      );
      console.log('searched products', this.filteredProducts);
    }
  }

  onProductClick(product: product) {
    // Check if the product is not already in the selectedProducts array
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      // Add the product to the selectedProducts array
      this.selectedProducts.push(product);
      const totalPrice =
        parseFloat(product.product_price) * (product.pax || 0) || 0;
      this.productTotals.push(totalPrice);

      // Optionally, you can log the selectedProducts array to the console
      console.log('Selected Products:', this.selectedProducts);
    }
  }

  removeSelectedProduct(index: number): void {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
    } else {
      console.error('Invalid index for removing selected product');
    }
  }

  calculateTotal(): number {
    let total = 0;
    for (const product of this.selectedProducts) {
      total += parseFloat(product.product_price) * product.pax!;
    }
    return total;
  }

  getBookingDetails(roomNumber: string) {
    this.selectedBooking = this.roomsBookings.find(
      (booking) => booking.room_number === roomNumber
    );
    console.log(this.selectedBooking);
  }

  makeTakeOutOrder() {
    // Check if there is enough quantity for each selected product
    const insufficientProduct = this.selectedProducts.find(
      (product) =>
        !product.is_service && product.pax! > product.product_quantity
    );

    if (insufficientProduct) {
      this.notificationService.error(
        `Not enough quantity for ${insufficientProduct.product_name}`
      );
      return; // Stop the process if there is not enough quantity
    }

    // If there is enough quantity, proceed with creating the order
    const itemsToUpdateQuantity = this.selectedProducts.map((product) => ({
      categoryId: product.category_id,
      productId: product.id,
      productData: {
        product_quantity: product.is_service
          ? product.product_quantity
          : product.product_quantity - product.pax!,
      },
    }));

    console.log('itemsToUpdateQuantity', itemsToUpdateQuantity);

    const itemsToSend = this.selectedProducts.map((product) => ({
      name: product.product_name,
      id: product.id,
      category_id: product.category_id,
      price: product.product_price,
      quantity: product.pax || 0,
    }));

    const order = {
      items: itemsToSend,
      room_number: this.roomNumber,
      customer_name: this.selectedBooking.customer_name,
      is_complete: false,
      total: parseInt(this.calculateTotal().toFixed(2)),
    };

    console.log('Order to make', order);

    this.adminservice.createRoomsSales(order).subscribe((data: any) => {
      this.notificationService.success('Room sales Made successfully', data);

      // Update product quantity for each selected product
      itemsToUpdateQuantity.forEach((item) => {
        this.menuService
          .updateProduct(item.productId, item.productData)
          .subscribe(
            () => {
              // Successfully updated product quantity
              this.selectedProducts = [];
              this.query = '';
              this.closePlaceOrderModal();
            },
            (error) => {
              console.error('Error updating product quantity:', error);
              this.notificationService.error(
                'Failed To Update Product Quantity'
              );
            }
          );
      });
    });
  }

  getRoomSales(roomNumber: any, customerName: any) {
    this.adminservice.getRoomsSales().subscribe((res: any) => {
      this.roomSales = res.filter((item: any) => {
        return (
          item.room_number == roomNumber && item.customer_name == customerName
        );
      });

      // Calculate the sum of the total of all orders
      const sumOfTotal = this.roomSales.reduce((acc: number, order: any) => {
        return acc + parseFloat(order.total);
      }, 0);
      this.roomTotalOrdersCost = sumOfTotal;

      console.log('Room Sales:', this.roomSales);
      console.log('Sum of Total:', this.roomTotalOrdersCost);
    });
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      if (this.selectedShiftId !== null) {
      }
    });
  }

  OpenRoomSales() {
    this.adminservice.getRoomsBookings().subscribe((response: any) => {
      this.roomsBookings = response.filter(
        (sale: any) => !sale.deleted && !sale.is_complete
      );
      console.log(response);
    });
  }
  closedRoomSales() {
    this.adminservice.getRoomsBookings().subscribe((response: any) => {
      this.roomsBookings = response.filter(
        (sale: any) => !sale.deleted && sale.is_complete
      );
      console.log(response);
    });
  }

  // room booking payments operations

  addToInput(number: number) {
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue + number;
    this.receivedAmount = currentValue + number;
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = this.receivedAmount;
      console.log('cash input', this.cashAmount);
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = this.receivedAmount;
      console.log('mpesa input', this.mpesaAmount);
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = this.receivedAmount;
      console.log('bank input', this.bankAmount);
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = this.receivedAmount;
    }
  }
  backspace() {
    // Remove the last character from the input field
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue.slice(0, -1);
    this.receivedAmount = currentValue.slice(0, -1);
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = currentValue.slice(0, -1);
    }
  }
  onPaymentModeChange() {
    // If any checkbox is checked, set receivedAmount to 0
    if (
      this.selectedPaymentMode === 'cash' ||
      this.selectedPaymentMode === 'mpesa' ||
      this.selectedPaymentMode === 'bank' ||
      this.selectedPaymentMode === 'Voucher' ||
      this.selectedPaymentMode === 'Complimentary'
    ) {
      this.amountInput.nativeElement.value = '';
    }
  }
  payAll() {
    this.receivedAmount =
      parseFloat(this.selectedOrderDetails.cost_per_day) * this.daySpent +
      this.roomTotalOrdersCost;
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = this.receivedAmount;
    }
    console.log('Received Amount', this.receivedAmount);
    console.log('cash Amount', this.cashAmount);
  }

  displayPaymentCard(orderId: any) {
    console.log('order id', orderId);
    console.log('all take out sales', this.takeOutSales);

    // Flatten the array before searching
    const flattenedSales = this.takeOutSales.flat();
    this.selectedOrderDetails = flattenedSales.find((x) => x.id === orderId);
    this.isOpen = true;
    this.orderId = orderId;

    console.log('selected order details', this.selectedOrderDetails);
  }

  updateOrder() {
    console.log('order id', this.orderId);
    if (this.selectedOrderDetails.id) {
      const totalToBePaid =
        parseFloat(this.selectedOrderDetails.cost_per_day) * this.daySpent +
        this.roomTotalOrdersCost;
      const parsedAmountPaid =
        parseFloat(this.selectedOrderDetails.amount_paid) || 0;
      const parsedReceived = parseFloat(this.receivedAmount);
      const added = parsedAmountPaid + parsedReceived;
      console.log('Parsed amount already paid:', parsedAmountPaid);
      const totalPaid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.bankAmount || 0);
      console.log('all payed amount:', totalPaid);
      const amountPaid = totalPaid + parsedAmountPaid;
      const Mpesa_paid =
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.selectedOrderDetails.mpesa_paid || 0);
      console.log('Mpesa paid amount:', Mpesa_paid);
      const Cash_paid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.selectedOrderDetails.cash_paid || 0);
      console.log('cash paid amount:', Cash_paid);
      const Bank_paid =
        parseFloat(this.bankAmount || 0) +
        parseFloat(this.selectedOrderDetails.bank_paid || 0);
      const Voucher_amount =
        parseFloat(this.voucherAmount || 0) +
        parseFloat(this.selectedOrderDetails.voucher_amount || 0);
      const Complimentary_amount =
        parseFloat(this.compilmentaryAmount || 0) +
        parseFloat(this.selectedOrderDetails.complimentary_amount || 0);
      const balance =
        parseFloat(this.selectedOrderDetails.amount_paid || 0) +
        totalPaid -
        totalToBePaid;

      let updatedOrderData: any = {
        amountPaid: amountPaid,
        Cash_paid: Cash_paid,
        Mpesa_paid: Mpesa_paid,
        Bank_paid: Bank_paid,
        shift_id: this.selectedShiftId,
      };
      // console.log('amount received', this.receivedAmount || this.cashAmount >0);

      // Check if the balance is 0 or more than zero
      if (balance >= 0) {
        updatedOrderData.is_complete = 1;
      } else {
        updatedOrderData.is_complete = 0;
      }
      console.log('dataa to be updated', updatedOrderData);
      this.adminservice
        .updateRoomsBooking(this.selectedOrderDetails.id, updatedOrderData)
        .subscribe(
          (response) => {
            // console.log('Response from paymensts', response)
            // this.submitPayments();
            // this.getAllTakeOutSales();
            this.markRoomFree(this.selectedOrderDetails.room_number);
            this.completeRoomSales(
              this.selectedOrderDetails.room_number,
              this.selectedOrderDetails.customer_name
            );
            this.notificationService.success('Payment Complete');
            this.closePaymentModal();
            this.getAllBookings();
          },
          (error) => {
            console.error('Update Order Error:', error);
            this.notificationService.error('Order failed to Make payment');
          }
        );
    } else {
      console.error('Order ID is not available for update');
    }
  }

  markRoomOcupied(room_number: string) {
    const room = this.rooms.find((x) => x.room_number === room_number);
    let data: any = {
      available: 0,
      cost_per_day: room.cost_per_day,
      room_number: room.room_number,
    };
    this.adminservice.updateRooms(room.id, data).subscribe((res: any) => {
      this.notificationService.success('Room marked occupied');
    });
  }
  markRoomFree(room_number: string) {
    const room = this.rooms.find((x) => x.room_number === room_number);
    let data: any = {
      available: 1,
      cost_per_day: room.cost_per_day,
      room_number: room.room_number,
    };
    this.adminservice.updateRooms(room.id, data).subscribe((res: any) => {
      this.notificationService.success('Room marked occupied');
    });
  }

  completeRoomSales(roomNumber: any, customerName: any) {
    this.adminservice.getRoomsSales().subscribe((res: any) => {
      this.roomSales = res.filter((item: any) => {
        return (
          item.room_number == roomNumber && item.customer_name == customerName
        );
      });
      console.log('Room sales', this.roomSales);

      // Iterate through filtered room sales and update them
      this.roomSales.forEach((roomSale: any) => {
        roomSale.is_complete = true; // Set is_complete to true
        this.adminservice.updateRoomsSales(roomSale.id, roomSale).subscribe(
          (updateRes: any) => {
            console.log('Room sale updated:', updateRes);
          },
          (error: any) => {
            console.error('Error updating room sale:', error);
          }
        );
      });
    });
  }

  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }
  openPlaceOrderModal(roonNumber: string) {
    this.roomNumber = roonNumber;
    this.getBookingDetails(roonNumber);
    this.isPlaceOrderModalOpen = true;
  }
  closePlaceOrderModal() {
    this.isPlaceOrderModalOpen = false;
  }

  openRoomSalesModal(roomNumber: any, customerName: any) {
    this.isRoomSalesModalOpen = true;
    this.getRoomSales(roomNumber, customerName);
  }
  closeRoomSalesModal() {
    this.isRoomSalesModalOpen = false;
  }
  openPaymentModal(id: number) {
    this.isPaymentOpen = true;
    this.selectedOrderDetails = this.roomsBookings.find(
      (sale: any) => sale.id === id
    );
    console.log(this.selectedOrderDetails);
    this.getRoomSales(
      this.selectedOrderDetails.room_number,
      this.selectedOrderDetails.customer_name
    );
  }
  closePaymentModal() {
    this.isPaymentOpen = false;
    this.daySpent = 0;
  }
}
