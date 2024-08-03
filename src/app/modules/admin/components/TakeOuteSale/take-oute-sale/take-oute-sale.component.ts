import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { Category } from 'src/app/modules/menu/interfaces/category';
import { Subscription } from 'rxjs';
import { product } from 'src/app/modules/menu/interfaces/products';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-take-oute-sale',
  templateUrl: './take-oute-sale.component.html',
  styleUrls: ['./take-oute-sale.component.scss'],
})
export class TakeOuteSaleComponent implements OnInit {
  tackOutOrganization: any[] = [];
  Awards: any[] = [];
  orginazation: any;
  selectedOrgId: any;
  award: any;
  selectedAward: any;
  selectedAwardPax: any;
  selectedAwardCost: any;
  selectedOrgName: any;
  categories: Category[] = [];
  filteredProducts: product[] = [];
  selectedProducts: product[] = [];
  products: any[] = [];
  query: any;
  private searchQuerySubscription: Subscription | undefined;
  loading: boolean = true;
  posting: boolean = false;

  constructor(
    private adminservice: AdminService,
    private menuService: MenuService,
    private searchService: SearchService,
    private notificationService: HotToastService
  ) {}
  ngOnInit(): void {
    this.getAllOrgs();
    this.getAllProducts();
    this.getAllOrgsAward();
  }

  getAllOrgs() {
    this.menuService.getAllTakeOutOrg().subscribe((data: any) => {
      console.log('All Orginazitions', data);
      this.tackOutOrganization = data;
      this.tackOutOrganization = Object.values(data.organizations);
    });
  }
  getSelectedOrg() {
    this.selectedOrgName = this.tackOutOrganization.find(
      (x) => x.id == this.selectedOrgId
    );
    console.log('selected org', this.selectedOrgName);
  }
  getAllTakeOutOrgAwarsById() {
    const id = this.award;
    console.log('id', id);

    this.adminservice.getAllTakeOutOrgAwarsById(id).subscribe((data: any) => {
      console.log('Full response data:', data);

      if (data && data.award) {
        this.selectedAward = data.award;
        console.log('selected award', this.selectedAward);
        this.getAllOrgsAward();
      } else {
        console.error('No awards data found');
      }
    });
  }

  getAllOrgsAward() {
    this.menuService.getAllTakeOutOrgAwars().subscribe((data: any) => {
      console.log('all awardsssss', data);
      this.Awards = Object.values(data);

      console.log('All Organizations awards', this.Awards);

      // Filter awards for the selectedOrgId and exclude those with null take_out_organization_id
      this.Awards = this.Awards.filter(
        (award: { take_out_organization_id: any }) => {
          // console.log("Award:", award);
          // console.log("Comparison:", award.take_out_organization_id, this.selectedOrgId);

          // Handle null values separately
          if (
            award.take_out_organization_id === null &&
            this.selectedOrgId === null
          ) {
            return true;
          }

          // Check for both equality and type for non-null values
          return (
            award.take_out_organization_id !== null &&
            award.take_out_organization_id == this.selectedOrgId
          );
        }
      );

      console.log("Selected Organization's awards", this.Awards);
    });
  }

  onOrgChange() {
    this.getAllOrgsAward();
    this.getSelectedOrg();
  }
  onAwardChange() {
    this.selectedAward = this.Awards.filter((award: { id: any }) => {
      return award.id !== null && award.id == this.award;
    });

    console.log('selected award', this.selectedAward);

    if (this.selectedAward.length > 0) {
      // console.log("pax:", this.selectedAward[0].pax);
      this.selectedAwardPax = this.selectedAward[0].pax;
      this.selectedAwardCost = this.selectedAward[0].cost_per_person;
      console.log('pax:', this.selectedAwardPax);
      console.log('costoe:', this.selectedAwardCost);
      // Add more properties as needed
    } else {
      console.error('No matching award found');
    }
  }

  getAllProducts() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      if (this.query) {
        this.filteredProducts = data.filter((product: any) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        );
        console.log('filterd products', this.products);
        this.loading = false;
      } else {
        this.filteredProducts = data.filter(
          (product: any) => !product.is_service
        );
        this.loading = false;
      }
    });
  }

  // filterCategories() {
  //   if (this.query.trim() === '') {
  //     this.loadCategoriesAndSetFirstCategory(); // Load all categories if the query is empty
  //   } else {
  //     const lowercaseQuery = this.query.toLowerCase();
  //     this.menuService.getCategories().subscribe((data: any) => {
  //       this.categories = data
  //         .map((category: any) => ({
  //           ...category,
  //           products: category.products
  //             .filter((product: any) =>
  //               product.product_name.toLowerCase().includes(lowercaseQuery)
  //             )
  //             .filter((product: any) => !product.deleted),
  //         }))
  //         .filter(
  //           (category: any) =>
  //             category.category_name.toLowerCase().includes(lowercaseQuery) ||
  //             category.products.length > 0 // Filter categories with matching products
  //         );
  //       // console.log('Filtered Categories', this.categories);
  //     });
  //   }
  // }

  subscribeToSearchQueryChanges() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query;
        console.log('Search input changed:', this.query);
        this.getAllProducts(); // Trigger reloading categories based on the new search query
      }
    );
  }
  onSearchInputChange() {
    this.getAllProducts();
  }
  unsubscribeFromSearchQueryChanges() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  onInputChange() {
    if (this.query != '') {
      // this.filteredProducts = this.categories.flatMap((category) =>
      //   category.products.filter((product) =>
      //     product.product_name.toLowerCase().includes(this.query.toLowerCase())
      //   )
      // );
      // console.log('searched products', this.filteredProducts);
      this.getAllProducts();
    }
  }

  onProductClick(product: product) {
    // Check if the product is not already in the selectedProducts array
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      // Add the product to the selectedProducts array
      this.selectedProducts.push(product);

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

    this.posting = true;

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
      selectedItems: product.pax || 0,
    }));

    const order = {
      items: itemsToSend,
      organization_name: this.selectedOrgName.name,
      award: this.selectedAward[0].type,
      pax: parseInt(this.selectedAwardPax),
      cost: this.selectedAwardCost,
      fully_paid: false,
      deleted: false,
      // date: new Date().toISOString(),
    };

    console.log('Order to make', order);

    this.adminservice.createTakeOutOrgSales(order).subscribe(
      (data: any) => {
        this.notificationService.success(
          'Take Out sales Made successfully',
          data
        );

        // Update product quantity for each selected product
        itemsToUpdateQuantity.forEach((item) => {
          this.menuService
            .updateProduct(item.productId, item.productData)
            .subscribe(
              () => {
                this.clearForm();
                // Successfully updated product quantity
              },
              (error) => {
                console.error('Error updating product quantity:', error);
                this.notificationService.error(
                  'Failed To Update Product Quantity'
                );
              }
            );
        });
        this.posting = false;
      },
      (error: any) => {
        // console.error('Error updating product quantity:', error);
        this.notificationService.error(
          'Failed To make Take Out Sale Check Your Internet Connection'
        );
        this.posting = false;
      }
    );
  }

  clearForm() {
    this.selectedOrgId = null;
    this.selectedProducts = [];
    this.selectedAward = null;
    this.selectedAwardPax = null;
    this.selectedAwardCost = null;
    this.selectedOrgName = null;
    this.query = '';
    this.award = null;
  }
}
