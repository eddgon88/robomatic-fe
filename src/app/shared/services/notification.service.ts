import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: ToastrService) { }

  showSuccess(mesagge: string): void {
    this.toastrService.success(mesagge, 'OK');
  }

  showInfo(mesagge: string): void {
    this.toastrService.info(mesagge, 'Info!');
  }

  showWarning(mesagge: string): void {
    this.toastrService.warning(mesagge, 'Warning!');
  }

  showError(mesagge: string): void {
    this.toastrService.error(mesagge, 'Error!');
  }

}
