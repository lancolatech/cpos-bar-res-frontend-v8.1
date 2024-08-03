import { Injectable } from '@angular/core';
import { ToastrConfig, ToastrService } from 'ngx-toastr';
import { NotificationInterface } from '../../interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastrService: ToastrService) {
    this.toastrService.toastrConfig.timeOut = 1500;
  }

  showSuccess(message: string, title?: string) {
    const notification: NotificationInterface = {
      title: title || 'Success',
      message,
    };
    this.toastrService.success(notification.message, notification.title);
  }

  showError(message: string, title?: string) {
    const notification: NotificationInterface = {
      title: title || 'Error',
      message,
    };
    this.toastrService.error(notification.message, notification.title);
  }

  showWarning(message: string, title?: string) {
    const notification: NotificationInterface = {
      title: title || 'Warning',
      message,
    };

    this.toastrService.warning(notification.message, notification.title);
  }

  showInfo(message: string, title?: string) {
    const notification: NotificationInterface = {
      title: title || 'Info',
      message,
    };
    this.toastrService.info(notification.message, notification.title);
  }
}
