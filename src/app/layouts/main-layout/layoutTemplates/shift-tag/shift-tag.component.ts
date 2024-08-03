import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shift-tag',
  standalone: true,
  templateUrl: './shift-tag.component.html',
  styleUrls: ['./shift-tag.component.scss']
})
export class ShiftTagComponent {
@Input() shift:any =''
}
