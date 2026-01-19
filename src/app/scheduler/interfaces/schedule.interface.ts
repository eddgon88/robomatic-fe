export interface Schedule {
  id: number;
  schedule_id: string;
  test_id: number;
  test_name: string;
  name: string;
  description: string;
  trigger_type: 'cron' | 'interval' | 'date';
  expression: CronExpression | IntervalExpression | DateExpression;
  status: string;
  status_code: number;
  next_run_time: string;
  last_run_time: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleListResponse {
  schedules: Schedule[];
  total: number;
}

export interface CronExpression {
  hour?: number;
  minute?: number;
  second?: number;
  day_of_week?: string;
  day?: string;
  month?: string;
  year?: string;
}

export interface IntervalExpression {
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface DateExpression {
  run_date: string;
}

export interface CreateScheduleRequest {
  test_id: number;
  name: string;
  description?: string;
  trigger_type: string;
  expression: CronExpression | IntervalExpression | DateExpression;
}

export interface UpdateScheduleRequest {
  name?: string;
  description?: string;
  trigger_type?: string;
  expression?: CronExpression | IntervalExpression | DateExpression;
}


