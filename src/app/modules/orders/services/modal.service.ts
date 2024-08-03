import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public isModalOpen = false;

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }
}
