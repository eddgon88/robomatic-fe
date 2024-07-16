import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrl: './confirm-mail.component.css'
})
export class ConfirmMailComponent implements OnInit {

  confirmSuccess: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      let token = url[1].path;
      this.confirm(token);
    });
    
  }

  confirm(token: string): void {
    this.authService.confirmUser(token).subscribe(
      response => {
        this.confirmSuccess = response.confirm;
      }, (err) => {
        this.notificationService.showError("An Error are ocurred confirming your account");
        console.log(err);
      })
  }

}
