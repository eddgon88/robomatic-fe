import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface UserData {
  fullName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  userMenuOpen = false;
  userName = 'User';
  userEmail = 'user@example.com';
  userRole = 'User';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        // Decode JWT to get user info
        const payload = this.decodeToken(token);
        if (payload) {
          this.userName = payload.fullName || payload.name || 'User';
          this.userEmail = payload.email || payload.sub || 'user@example.com';
          this.userRole = payload.role || 'User';
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closeUserMenu();
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
