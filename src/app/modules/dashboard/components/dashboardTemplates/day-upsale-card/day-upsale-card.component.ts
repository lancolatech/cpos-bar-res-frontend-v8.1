import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-day-upsale-card',
  templateUrl: './day-upsale-card.component.html',
  styleUrls: ['./day-upsale-card.component.scss'],
})
export class DayUpsaleCardComponent implements OnChanges, OnInit {
  showAllContent = false;
  @ViewChild('upsalesDiv')
  upsalesDiv!: ElementRef;
  mostSoldItems: any[] = [];
  @Input() selectedShiftId: string = '';

  constructor(
    private menuService: MenuService,
    private shiftService: ShiftService
  ) {}
  ngOnInit(): void {
    this.getMostSoldItems();
    // console.log('sent current shift id', this.selectedShiftId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedShiftId'] && !changes['selectedShiftId'].firstChange) {
      // If selectedShiftId changes and it's not the initial change
      this.getMostSoldItems();
      // console.log('sent shift id', this.selectedShiftId);
    }
  }

  toggleScroll() {
    const divElement = this.upsalesDiv.nativeElement;
    divElement.style.overflowY =
      divElement.style.overflowY === 'hidden' ? 'auto' : 'hidden';
  }

  getMostSoldItems() {
    this.shiftService.currentShift$.subscribe((shift) => {
      console.log('shiftdfffsgsdg', shift);
      if (shift) {
        this.menuService
          .getAllPostedOrdersForShift(shift.id)
          .subscribe((orders: any[]) => {
            const ordersInShift = orders;
            console.log('orders for the shift', orders);

            // Extract all items from orders and parse JSON strings to objects
            const allItems = ordersInShift.flatMap((order) => order.Items);

            // Calculate item counts
            const itemCounts = allItems.reduce((counts: any, item: any) => {
              const quantity = parseFloat(item.selectedItems) || 0;
              counts[item.name] = (counts[item.name] || 0) + quantity;
              return counts;
            }, {});
            // console.log('itemscount',itemCounts)

            // Convert counts object to an array of objects
            this.mostSoldItems = Object.keys(itemCounts).map((name) => ({
              name,
              quantitySold: itemCounts[name],
            }));

            // Sort most sold items by quantity sold in descending order
            this.mostSoldItems.sort((a, b) => b.quantitySold - a.quantitySold);
            // console.log('itemscount',this.mostSoldItems)
          });
      } else {
        console.error('No current shift found');
        // Handle scenario where no shift is found
      }
    });
  }
}
