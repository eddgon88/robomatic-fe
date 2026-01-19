import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isAdmin: boolean = false;
  canCreateTest: boolean = false;
  canSchedule: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkUserRole();
  }

  private checkUserRole(): void {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const payload = this.decodeToken(token);
        if (payload && payload.role) {
          this.isAdmin = payload.role === 'ADMIN';
          this.canCreateTest = payload.role === 'ADMIN' || payload.role === 'ANALYST';
          // Scheduler disponible para todos excepto VIEWER
          this.canSchedule = payload.role !== 'VIEWER';
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
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

}
