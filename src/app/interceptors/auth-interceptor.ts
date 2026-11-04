import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');
    if (token && !request.url.includes('/auth/')) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthEndpoint = request.url.includes('/auth/');
        const businessErrorCode = error?.error?.code;
        const isBusinessPermissionError = typeof businessErrorCode === 'string' && businessErrorCode.startsWith('E403');

        if (!isAuthEndpoint && (error.status === 401 || (error.status === 403 && !isBusinessPermissionError))) {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
