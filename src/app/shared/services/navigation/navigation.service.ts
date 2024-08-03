import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { menuItemsData } from '../../data/navigation/navigation.data';
// import { MenuItemInterface, MenuItemTitlesEnum } from '../../interfaces/navigation/navigation-menu.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  // menuItem = new BehaviorSubject<MenuItemInterface | null>(null);
  sidenavMode = new BehaviorSubject<'over' | 'side'>('side');
  sidenavClosed = new BehaviorSubject<boolean>(false);

  constructor() { }

  // scrollToTop(elementId: string) {
  //   const element: Element | null = document.getElementById(elementId);
  //   if (element) {
  //     element.scrollTo(0, 0);

  //   }
  // }

  scrollToTop(elementId: string) {
    const element: Element | null = document.getElementById(elementId);
    if (element) {
      element.scrollTo(0, 0);

    }
  }

  toggleSidenavMode(mode: 'over' | 'side') {
    this.sidenavMode.next(mode);
  }

  closeOrOpenSidenav(close: boolean) {
    this.sidenavClosed.next(close);
  }

  // getMenuItem(title: MenuItemTitlesEnum): MenuItemInterface | null {
  //   const menuItem = menuItemsData.find((item) => item.title === title) || null;
  //   return menuItem;
  // }

  // setMenuItem(title: MenuItemTitlesEnum | null) {
  //   if (!title) {
  //     this.menuItem.next(null);
  //     return;
  //   }
  //   const menuItem = this.getMenuItem(title);
  //   this.menuItem.next(menuItem);
  // }


}
