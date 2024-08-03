import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss']
})
export class ReservationCardComponent {
  data = [
    {
      room: "A1",
      room_status: "Reserved",
      time: "18:30pm"
    },

    {
      room: "A1",
      room_status: "Reserved",
      time: "18:30pm"
    },
    {
      room: "A1",
      room_status: "Reserved",
      time: "18:30pm"
    },
    {
      room: "A1",
      room_status: "Reserved",
      time: "18:30pm"
    },
    {
      room: "A1",
      room_status: "Reserved",
      time: "18:30pm"
    }

  ]
}
