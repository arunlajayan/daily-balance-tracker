export interface UserProfileDTO {
  userId: string;
  email: string;
  fullName?: string | null;
  timezone: string;
}

export interface WorkItemDTO {
  logId: string;
  taskId: string;
  taskName: string;
  estHours: number;
  timeSpentToday: number;
  progressPercent: number;
}

export interface SleepLogDTO {
  sleepId: string;
  bedTime: string | null;
  wakeTime: string | null;
  targetSleep: number;
  actualDuration: number;
}

export interface LeisureItemDTO {
  logId: string;
  categoryId: string;
  activityName: string;
  durationHours: number;
}

export interface DailySummaryDTO {
  totalWork: number;
  totalSleep: number;
  totalLeisure: number;
  remainingHours: number;
}

export interface DailyTrackerPayload {
  trackerId: string;
  logDate: string;
  isClosed: boolean;
  user: UserProfileDTO;
  summary: DailySummaryDTO;
  sleep: SleepLogDTO | null;
  workItems: WorkItemDTO[];
  leisureItems: LeisureItemDTO[];
}
