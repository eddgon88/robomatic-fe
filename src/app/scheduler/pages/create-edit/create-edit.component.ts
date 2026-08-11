import { Component, OnInit, Input, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  CronExpression,
  IntervalExpression,
  DateExpression
} from '../../interfaces/schedule.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestService } from 'src/app/test/services/test.service';
import { TestRecord } from 'src/app/test/interfaces/test-record';

@Component({
  selector: 'app-schedule-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class ScheduleCreateEditComponent implements OnInit {

  isEditMode = false;
  scheduleId: string | null = null;
  loading = false;
  loadingTests = true;
  saving = false;

  // Modal inputs
  @Input() isModal = false;
  @Input() preSelectedTestId: number | null = null;
  @Input() preSelectedTestName: string = '';
  @Input() existingSchedule: Schedule | null = null;

  // Form fields
  name = '';
  description = '';
  selectedTestId: number | null = null;
  triggerType: 'cron' | 'interval' | 'date' = 'cron';

  // Cron fields
  cronHour = 8;
  cronMinute = 0;
  selectedDays: string[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

  // Interval fields
  intervalDays = 0;
  intervalHours = 1;
  intervalMinutes = 0;

  // Date fields
  runDate = '';
  runTime = '08:00';

  // Available tests
  availableTests: TestRecord[] = [];

  // Status for pause/resume
  currentStatus: string = 'active';

  // Days of week options
  daysOfWeek = [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
    { value: 'sun', label: 'Sun' }
  ];

  constructor(
    private scheduleService: ScheduleService,
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    @Optional() public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.paramMap.get('scheduleId');
    this.isEditMode = !!this.scheduleId;

    this.loadTests();

    if (this.isEditMode && this.scheduleId) {
      this.loadSchedule(this.scheduleId);
    } else if (this.isModal && this.existingSchedule) {
      this.isEditMode = true;
      this.scheduleId = this.existingSchedule.schedule_id;
      this.populateForm(this.existingSchedule);
      this.currentStatus = this.existingSchedule.status;
    } else {
      this.setDefaultRunDate();
      if (this.isModal && this.preSelectedTestId) {
        this.selectedTestId = this.preSelectedTestId;
      }
    }
  }

  loadTests(): void {
    this.loadingTests = true;
    // Load tests where user has owner or edit permissions
    this.testService.getSchedulableTests().subscribe({
      next: (records) => {
        this.availableTests = records;
        this.availableTests = records;
        this.loadingTests = false;
        if (this.isModal && this.preSelectedTestId) {
          const exist = this.availableTests.find(t => t.id === this.preSelectedTestId);
          if (!exist) {
            // Add dummy record if not found (though backend should return it if we have permission)
            this.availableTests.push({ id: this.preSelectedTestId, name: this.preSelectedTestName } as TestRecord);
          }
          this.selectedTestId = this.preSelectedTestId;
        }
      },
      error: (err) => {
        console.error('Error loading tests:', err);
        this.notificationService.showError('Error loading tests');
        this.loadingTests = false;
      }
    });
  }

  loadSchedule(scheduleId: string): void {
    this.loading = true;
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (schedule) => {
        this.populateForm(schedule);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading schedule:', err);
        this.notificationService.showError('Error loading schedule');
        this.loading = false;
        this.router.navigate(['/scheduler']);
      }
    });
  }

  populateForm(schedule: Schedule): void {
    this.name = schedule.name;
    this.description = schedule.description || '';
    this.selectedTestId = schedule.test_id;
    this.triggerType = schedule.trigger_type;

    if (schedule.trigger_type === 'cron') {
      const expr = schedule.expression as CronExpression;
      this.cronHour = expr.hour || 8;
      this.cronMinute = expr.minute || 0;
      if (expr.day_of_week) {
        this.selectedDays = expr.day_of_week.split(',');
      }
    } else if (schedule.trigger_type === 'interval') {
      const expr = schedule.expression as IntervalExpression;
      this.intervalDays = expr.days || 0;
      this.intervalHours = expr.hours || 0;
      this.intervalMinutes = expr.minutes || 0;
    } else if (schedule.trigger_type === 'date') {
      const expr = schedule.expression as DateExpression;
      if (expr.run_date) {
        const date = new Date(expr.run_date);
        this.runDate = date.toISOString().split('T')[0];
        this.runTime = date.toTimeString().substring(0, 5);
      }
    }
  }

  setDefaultRunDate(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.runDate = tomorrow.toISOString().split('T')[0];
  }

  toggleDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index > -1) {
      if (this.selectedDays.length > 1) {
        this.selectedDays.splice(index, 1);
      }
    } else {
      this.selectedDays.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  buildExpression(): CronExpression | IntervalExpression | DateExpression {
    if (this.triggerType === 'cron') {
      return {
        hour: this.cronHour,
        minute: this.cronMinute,
        day_of_week: this.selectedDays.join(',')
      };
    } else if (this.triggerType === 'interval') {
      const expr: IntervalExpression = {};
      if (this.intervalDays > 0) expr.days = this.intervalDays;
      if (this.intervalHours > 0) expr.hours = this.intervalHours;
      if (this.intervalMinutes > 0) expr.minutes = this.intervalMinutes;
      return expr;
    } else {
      return {
        run_date: `${this.runDate} ${this.runTime}:00`
      };
    }
  }

  isFormValid(): boolean {
    if (!this.name.trim()) return false;
    if (!this.isEditMode && !this.selectedTestId) return false;

    if (this.triggerType === 'interval') {
      return this.intervalDays > 0 || this.intervalHours > 0 || this.intervalMinutes > 0;
    }
    if (this.triggerType === 'date') {
      return !!this.runDate && !!this.runTime;
    }
    if (this.triggerType === 'cron') {
      return this.selectedDays.length > 0;
    }

    return true;
  }

  save(): void {
    if (!this.isFormValid()) {
      this.notificationService.showError('Please fill all required fields');
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.scheduleId) {
      this.updateSchedule();
    } else {
      this.createSchedule();
    }
  }

  createSchedule(): void {
    const request: CreateScheduleRequest = {
      test_id: this.selectedTestId!,
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      trigger_type: this.triggerType,
      expression: this.buildExpression()
    };

    this.scheduleService.createSchedule(request).subscribe({
      next: (schedule) => {
        this.notificationService.showSuccess('Schedule created successfully');
        this.saving = false;
        if (this.isModal && this.activeModal) {
          this.activeModal.close(true);
        } else {
          this.router.navigate(['/scheduler']);
        }
      },
      error: (err) => {
        console.error('Error creating schedule:', err);
        const message = err.error?.message || 'Error creating schedule';
        this.notificationService.showError(message);
        this.saving = false;
      }
    });
  }

  updateSchedule(): void {
    const request: UpdateScheduleRequest = {
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      trigger_type: this.triggerType,
      expression: this.buildExpression()
    };

    this.scheduleService.updateSchedule(this.scheduleId!, request).subscribe({
      next: (schedule) => {
        this.notificationService.showSuccess('Schedule updated successfully');
        this.saving = false;
        if (this.isModal && this.activeModal) {
          this.activeModal.close(true);
        } else {
          this.router.navigate(['/scheduler']);
        }
      },
      error: (err) => {
        console.error('Error updating schedule:', err);
        const message = err.error?.message || 'Error updating schedule';
        this.notificationService.showError(message);
        this.saving = false;
      }
    });
  }

  cancel(): void {
    if (this.isModal && this.activeModal) {
      this.activeModal.dismiss();
    } else {
      this.router.navigate(['/scheduler']);
    }
  }

  getSchedulePreview(): string {
    if (this.triggerType === 'cron') {
      const time = `${this.cronHour.toString().padStart(2, '0')}:${this.cronMinute.toString().padStart(2, '0')}`;
      const days = this.selectedDays.map(d => {
        const day = this.daysOfWeek.find(dw => dw.value === d);
        return day?.label || d;
      }).join(', ');
      return `Every ${days} at ${time}`;
    } else if (this.triggerType === 'interval') {
      const parts: string[] = [];
      if (this.intervalDays > 0) parts.push(`${this.intervalDays} day(s)`);
      if (this.intervalHours > 0) parts.push(`${this.intervalHours} hour(s)`);
      if (this.intervalMinutes > 0) parts.push(`${this.intervalMinutes} minute(s)`);
      return `Every ${parts.join(', ')}`;
    } else {
      if (this.runDate && this.runTime) {
        return `Once on ${this.runDate} at ${this.runTime}`;
      }
      return 'Select date and time';
    }
  }

  pauseSchedule(): void {
    if (!this.scheduleId) return;
    this.saving = true;
    this.scheduleService.pauseSchedule(this.scheduleId).subscribe({
      next: (schedule) => {
        this.currentStatus = schedule.status;
        this.notificationService.showSuccess('Schedule paused');
        this.saving = false;
      },
      error: (err) => {
        console.error('Error pausing schedule:', err);
        this.notificationService.showError('Error pausing schedule');
        this.saving = false;
      }
    });
  }

  resumeSchedule(): void {
    if (!this.scheduleId) return;
    this.saving = true;
    this.scheduleService.resumeSchedule(this.scheduleId).subscribe({
      next: (schedule) => {
        this.currentStatus = schedule.status;
        this.notificationService.showSuccess('Schedule resumed');
        this.saving = false;
      },
      error: (err) => {
        console.error('Error resuming schedule:', err);
        this.notificationService.showError('Error resuming schedule');
        this.saving = false;
      }
    });
  }
}

