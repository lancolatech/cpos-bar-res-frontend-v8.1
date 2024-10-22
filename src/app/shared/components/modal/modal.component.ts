import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRemoteControl } from '@ng-vibe/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../services/auth/auth.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  dialogRemoteControl: DialogRemoteControl = inject(DialogRemoteControl);
  localStorageService = inject(LocalStorageService);
  toast = inject(HotToastService);
  authService = inject(AuthService);
  router = inject(Router);
  constructor() {
    console.log(this.dialogRemoteControl.payload);
  }

  close(payload?: any): void {
    const data = { payload: payload };
    this.dialogRemoteControl.closeDialog(data);
  }
  reloadPage(currentRoute: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentRoute]);
  }
}
