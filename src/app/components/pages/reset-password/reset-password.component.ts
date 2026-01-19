import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  loading: boolean = true;
  validatingToken: boolean = true;
  tokenValid: boolean = false;
  tokenError: string = '';
  maskedEmail: string = '';
  
  resetting: boolean = false;
  resetSuccess: boolean = false;

  // UI states
  passwordFocused: boolean = false;
  confirmFocused: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Obtener token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.loading = false;
      this.validatingToken = false;
      this.tokenError = 'Recovery token not provided';
      return;
    }

    // Validar el token
    this.validateToken();
  }

  validateToken(): void {
    this.authService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.loading = false;
        this.validatingToken = false;
        
        if (response.success) {
          this.tokenValid = true;
          this.maskedEmail = response.email || '';
        } else {
          this.tokenValid = false;
          this.tokenError = response.message || 'Invalid token';
        }
      },
      error: (err) => {
        this.loading = false;
        this.validatingToken = false;
        this.tokenValid = false;
        this.tokenError = 'Error validating recovery link';
        console.error('Error:', err);
      }
    });
  }

  resetPassword(): void {
    // Validaciones
    if (!this.newPassword) {
      this.notificationService.showError('Please enter a new password');
      return;
    }

    if (this.newPassword.length < 6) {
      this.notificationService.showError('Password must be at least 6 characters');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showError('Passwords do not match');
      return;
    }

    this.resetting = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.resetting = false;
        
        if (response.success) {
          this.resetSuccess = true;
          this.notificationService.showSuccess('Password updated successfully');
        } else {
          this.notificationService.showError(response.message || 'Error updating password');
        }
      },
      error: (err) => {
        this.resetting = false;
        this.notificationService.showError('Error updating password');
        console.error('Error:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  requestNewLink(): void {
    this.router.navigate(['/forgot-password']);
  }

}
