import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-link',
  standalone:true,
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.scss']
})
export class NavLinkComponent {
  @Input() navLinkName:string=''

}
