import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-show-all-incredients',
  templateUrl: './show-all-incredients.component.html',
  styleUrls: ['./show-all-incredients.component.scss'],
})
export class ShowAllIncredientsComponent {
  incredients: any[] = [];
  query: any;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.getAllIncredients();
  }

  getAllIncredients() {
    this.adminService.getIngredient().subscribe((response) => {
      if (this.query) {
        this.incredients = response.filter(
          (incredient: {
            name: string;
            unitOfMeasurement: string;
            quantity: { toString: () => string | any[] };
            price: { toString: () => string | any[] };
          }) => {
            return (
              incredient.name
                .toLowerCase()
                .includes(this.query.toLowerCase()) ||
              incredient.unitOfMeasurement
                .toLowerCase()
                .includes(this.query.toLowerCase()) ||
              incredient.quantity
                .toString()
                .includes(this.query.toLowerCase()) ||
              incredient.price.toString().includes(this.query.toLowerCase())
            );
          }
        );
      } else {
        this.incredients = response;
      }
    });
  }
}
