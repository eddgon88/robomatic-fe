import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../components/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard  {

  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

  
    if (!this.authService.isAuthenticated()) {
        sessionStorage.removeItem("token");
        this.router.navigate(['/login']);
        return false;
    } 

    return true;
    }

}