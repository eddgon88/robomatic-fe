import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '../../interfaces/schedule.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-scheduler-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class SchedulerHomeComponent implements OnInit {

  schedules: Schedule[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.loading = true;
    this.scheduleService.getAllSchedules().subscribe({
      next: (response) => {
        this.schedules = response.schedules || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
        this.notificationService.showError('Error loading schedules');
        this.loading = false;
      }
    });
  }

  get filteredSchedules(): Schedule[] {
    if (!this.searchTerm) return this.schedules;
    const term = this.searchTerm.toLowerCase();
    return this.schedules.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.test_name.toLowerCase().includes(term)
    );
  }

  createSchedule(): void {
    this.router.navigate(['/scheduler/create']);
  }

  editSchedule(schedule: Schedule): void {
    this.router.navigate(['/scheduler/edit', schedule.schedule_id]);
  }

  toggleStatus(schedule: Schedule): void {
    if (schedule.status === 'active') {
      this.pauseSchedule(schedule);
    } else if (schedule.status === 'paused') {
      this.resumeSchedule(schedule);
    }
  }

  pauseSchedule(schedule: Schedule): void {
    this.scheduleService.pauseSchedule(schedule.schedule_id).subscribe({
      next: (updated) => {
        this.notificationService.showSuccess('Schedule paused');
        this.loadSchedules();
      },
      error: (err) => {
        console.error('Error pausing schedule:', err);
        this.notificationService.showError('Error pausing schedule');
      }
    });
  }

  resumeSchedule(schedule: Schedule): void {
    this.scheduleService.resumeSchedule(schedule.schedule_id).subscribe({
      next: (updated) => {
        this.notificationService.showSuccess('Schedule resumed');
        this.loadSchedules();
      },
      error: (err) => {
        console.error('Error resuming schedule:', err);
        this.notificationService.showError('Error resuming schedule');
      }
    });
  }

  confirmDelete(schedule: Schedule): void {
    this.modalService.confirm(
      'Delete Schedule',
      `Are you sure you want to delete the schedule "${schedule.name}"?`,
      'Delete',
      'Cancel'
    ).then((confirmed) => {
      if (confirmed) {
        this.deleteSchedule(schedule);
      }
    });
  }

  deleteSchedule(schedule: Schedule): void {
    this.scheduleService.deleteSchedule(schedule.schedule_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Schedule deleted');
        this.loadSchedules();
      },
      error: (err) => {
        console.error('Error deleting schedule:', err);
        this.notificationService.showError('Error deleting schedule');
      }
    });
  }

  getTriggerTypeLabel(type: string): string {
    switch (type) {
      case 'cron': return 'Cron';
      case 'interval': return 'Interval';
      case 'date': return 'One-time';
      default: return type;
    }
  }

  getTriggerTypeIcon(type: string): string {
    switch (type) {
      case 'cron': return 'bi-calendar2-week';
      case 'interval': return 'bi-arrow-repeat';
      case 'date': return 'bi-calendar-check';
      default: return 'bi-clock';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      default: return 'status-unknown';
    }
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  formatExpression(schedule: Schedule): string {
    if (schedule.trigger_type === 'cron') {
      const expr = schedule.expression as any;
      const parts: string[] = [];
      if (expr.hour !== undefined) parts.push(`${expr.hour}:${expr.minute || '00'}`);
      if (expr.day_of_week) parts.push(`Days: ${expr.day_of_week}`);
      return parts.join(' | ') || 'Custom cron';
    } else if (schedule.trigger_type === 'interval') {
      const expr = schedule.expression as any;
      const parts: string[] = [];
      if (expr.days) parts.push(`${expr.days} days`);
      if (expr.hours) parts.push(`${expr.hours} hours`);
      if (expr.minutes) parts.push(`${expr.minutes} minutes`);
      return `Every ${parts.join(', ')}`;
    } else if (schedule.trigger_type === 'date') {
      const expr = schedule.expression as any;
      return this.formatDateTime(expr.run_date);
    }
    return '-';
  }
}

