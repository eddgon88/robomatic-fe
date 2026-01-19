import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = '';
  loading: boolean = false;
  emailSent: boolean = false;
  maskedEmail: string = '';
  emailFocused: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tests']);
    }
  }

  requestRecovery(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.notificationService.showError('Por favor ingresa un email válido');
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.emailSent = true;
        this.maskedEmail = response.email || this.maskEmail(this.email);
        this.notificationService.showSuccess('Revisa tu correo electrónico');
      },
      error: (err) => {
        this.loading = false;
        // Por seguridad, mostramos el mismo mensaje aunque falle
        this.emailSent = true;
        this.maskedEmail = this.maskEmail(this.email);
        console.error('Error:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '***';
    const parts = email.split('@');
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return name.charAt(0) + '***@' + domain;
    return name.substring(0, 2) + '***@' + domain;
  }

}

