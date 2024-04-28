import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SingUpRequestModel } from '../../models/sing-up-request-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  confirmPassword!: string;
  loginMode: boolean = true;
  singupMode: boolean = false;
  singUpSuccess: boolean = false;
  singUpRequest = new SingUpRequestModel();

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/tests']);
    } else {
      sessionStorage.removeItem("token");
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        let token = response.headers.get('authorization');
        if (token)
          sessionStorage.setItem("token", token);
          this.router.navigate(['/tests']);
      }, (err) => {
        this.notificationService.showError("User and/or password are incorrect")
        console.log(err)
      })
  }

  singup() {
    console.log("singup");
    console.log(this.username);
    if (this.singUpRequest.pass === this.confirmPassword) {
      this.authService.singup(this.singUpRequest).subscribe(
        response => {
          this.notificationService.showSuccess("Succesfull sing up");
          this.singupMode = false;
          this.singUpSuccess = true;
        }, (err) => {
          this.notificationService.showError("Error trying to sing");
          console.log(err);
        })
    } else {
      this.notificationService.showError("Password must be confirmed");
    }
  }

  changeMode(mode: string) {

    this.loginMode = mode === "login";
    this.singupMode = mode === "singup";

  }



}
