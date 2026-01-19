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
  loading: boolean = false;

  // Focus states for login
  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  showPassword: boolean = false;

  // Focus states for signup
  signupEmailFocused: boolean = false;
  firstNameFocused: boolean = false;
  lastNameFocused: boolean = false;
  phoneFocused: boolean = false;
  signupPasswordFocused: boolean = false;
  confirmPasswordFocused: boolean = false;
  showSignupPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Terms and conditions
  acceptedTerms: boolean = false;
  showTermsModal: boolean = false;

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
    if (!this.username || !this.password) {
      this.notificationService.showError("Please enter email and password");
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.loading = false;
        let token = response.headers.get('authorization');
        if (token)
          sessionStorage.setItem("token", token);
          this.router.navigate(['/tests']);
      }, (err) => {
        this.loading = false;
        this.notificationService.showError("User and/or password are incorrect");
        console.log(err);
      })
  }

  singup() {
    if (!this.singUpRequest.email || !this.singUpRequest.fist_name || 
        !this.singUpRequest.last_name || !this.singUpRequest.pass) {
      this.notificationService.showError("Please fill all required fields");
      return;
    }

    if (this.singUpRequest.pass !== this.confirmPassword) {
      this.notificationService.showError("Passwords do not match");
      return;
    }

    if (this.singUpRequest.pass.length < 6) {
      this.notificationService.showError("Password must be at least 6 characters");
      return;
    }

    if (!this.acceptedTerms) {
      this.notificationService.showError("You must accept the Terms and Conditions");
      return;
    }

    this.loading = true;
    this.authService.singup(this.singUpRequest).subscribe(
      response => {
        this.loading = false;
        this.notificationService.showSuccess("Account created successfully");
        this.singupMode = false;
        this.singUpSuccess = true;
      }, (err) => {
        this.loading = false;
        this.notificationService.showError("Error creating account. Please try again.");
        console.log(err);
      })
  }

  changeMode(mode: string) {
    this.loginMode = mode === "login";
    this.singupMode = mode === "singup";
    this.singUpSuccess = false;
    
    // Reset form data when switching modes
    if (mode === "login") {
      this.singUpRequest = new SingUpRequestModel();
      this.confirmPassword = '';
      this.acceptedTerms = false;
    } else {
      this.username = '';
      this.password = '';
    }
  }

  openTermsModal(): void {
    this.showTermsModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
    document.body.style.overflow = 'auto';
  }

  acceptTermsFromModal(): void {
    this.acceptedTerms = true;
    this.closeTermsModal();
  }
}
