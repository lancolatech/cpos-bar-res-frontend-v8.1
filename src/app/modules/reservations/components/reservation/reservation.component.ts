import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  days: string[] = [];
  selectedDay: string = "";

  ngOnInit() {
    this.generateLast10Days();
  }

  generateLast10Days() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    for (let i = 0; i < 10; i++) {
      const day = lastDayOfMonth - i;
      const formattedDate = today.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      this.days.push(formattedDate);
    }
  }

}
