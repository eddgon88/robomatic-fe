import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SingUpRequestModel } from '../../models/sing-up-request-model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  singUpRequest = new SingUpRequestModel();
  confirmPassword: string = '';
  loading: boolean = false;
  registrationSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Verificar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tests']);
    }
  }

  register(): void {
    // Validaciones
    if (!this.singUpRequest.email || !this.singUpRequest.fist_name ||
      !this.singUpRequest.last_name || !this.singUpRequest.pass) {
      this.notificationService.showError('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.singUpRequest.pass !== this.confirmPassword) {
      this.notificationService.showError('Las contraseñas no coinciden');
      return;
    }

    if (this.singUpRequest.pass.length < 8) {
      this.notificationService.showError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.loading = true;

    this.authService.singup(this.singUpRequest).subscribe(
      response => {
        this.loading = false;
        this.registrationSuccess = true;
        this.notificationService.showSuccess('Registro exitoso! Revisa tu email para confirmar tu cuenta');
      },
      error => {
        this.loading = false;
        console.error('Error en registro:', error);
        if (error.status === 400) {
          this.notificationService.showError('El email ya está registrado');
        } else {
          this.notificationService.showError('Error al registrar usuario. Intente nuevamente');
        }
      }
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
