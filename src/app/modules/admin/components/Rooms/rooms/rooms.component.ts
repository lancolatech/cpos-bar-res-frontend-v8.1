import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  isOpen = false;
  rooms:any[]=[];
  newRoom = {
    room_number: '',
    cost_per_day: 0,
    available: true,
  };
  constructor( 
    private adminService: AdminService,
    ) { }
  ngOnInit() {
    this.getAllRooms();
  }

  openModal(){
    this.isOpen = true;
  }
  closeModal(){
    this.isOpen = false;
  }

  getAllRooms(){
    this.adminService.getRooms().subscribe((response:any)=>{
      this.rooms = response;
      console.log(response);
    });
  }

  AddRoom(){
    this.adminService.createRooms(this.newRoom).subscribe((response:any)=>{
      // this.rooms.push(response);
      // Clear the form after adding a new room
      this.newRoom = {
        room_number: '',
        cost_per_day: 0,
        available: true,
      };
    });
    this.getAllRooms();
    this.closeModal();
  }

}
