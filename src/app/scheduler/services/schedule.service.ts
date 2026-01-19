import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { bff } from 'src/environments/environment';
import { 
  Schedule, 
  ScheduleListResponse, 
  CreateScheduleRequest, 
  UpdateScheduleRequest 
} from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private baseUrl = `${bff.protocol}${bff.host.replace('/v1', '')}/v1/schedules`;

  constructor(private http: HttpClient) { }

  getAllSchedules(): Observable<ScheduleListResponse> {
    return this.http.get<ScheduleListResponse>(this.baseUrl);
  }

  getScheduleById(scheduleId: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.baseUrl}/${scheduleId}`);
  }

  getScheduleByTestId(testId: number): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.baseUrl}/test/${testId}`);
  }

  createSchedule(request: CreateScheduleRequest): Observable<Schedule> {
    return this.http.post<Schedule>(this.baseUrl, request);
  }

  updateSchedule(scheduleId: string, request: UpdateScheduleRequest): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/${scheduleId}`, request);
  }

  deleteSchedule(scheduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${scheduleId}`);
  }

  pauseSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.baseUrl}/${scheduleId}/pause`, {});
  }

  resumeSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.baseUrl}/${scheduleId}/resume`, {});
  }
}

