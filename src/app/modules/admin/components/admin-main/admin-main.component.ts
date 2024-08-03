import { Component } from '@angular/core';
import { AddProductFormComponent } from '../add-product-form/add-product-form.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
})
export class AdminMainComponent {
  users: any[] = []; // Replace with your user data structure
  paginatedUsers: any[] = [];
  itemsPerPage = 5; // Number of items per page
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';
constructor(private adminService:AdminService){

}
  ngOnInit(): void {
    const token = localStorage.getItem('jwttoken')
    if(token){
      this.getAllUser(token)
    }
    // Initialize your user data here
    // You can fetch data from a service or use a predefined array


    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  // onSearch(): void {
  //   this.searchQuery = query.toLowerCase();

  //   this.paginatedUsers = this.users.filter((user) =>
  //     user.name.toLowerCase().includes(this.searchQuery) ||
  //     user.email.toLowerCase().includes(this.searchQuery)
  //   );

  //   this.totalPages = Math.ceil(this.paginatedUsers.length / this.itemsPerPage);
  //   this.currentPage = 1;
  //   this.paginateData();
  // }

  getAllUser(token:string){
    this.adminService.getAllUsers().subscribe({
      next: res=>{
        console.log(res.pos_users)
        for(let user in res.pos_users){
          let userDetails = res.pos_users[user];
          userDetails.id = user;
          this.users.push(userDetails)
          console.log(this.users)
        }
      },
      error:err=>{
        console.log(err)
      }
    })
  }
}
