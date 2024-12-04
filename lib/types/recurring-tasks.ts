export type Frequency = "daily" | "weekly" | "monthly"

export interface Schedule {
  frequency: Frequency
  weekDay?: number
  monthDay?: number
}

export interface RecurringTask {
  id: string
  user_id: string
  title: string
  time: string | null
  client_id: string | null
  project_id: string | null
  frequency: Frequency
  week_day: number | null
  month_day: number | null
  created_at: string
  client_name?: string | null
  client_emoji?: string | null
  project_name?: string | null
}

export interface RecurringTaskInput {
  title: string
  time?: string | null
  client_id?: string | null
  project_id?: string | null
  schedule: Schedule
}

export interface RecurringTaskUpdate {
  title?: string
  time?: string | null
  client_id?: string | null
  project_id?: string | null
  frequency?: Frequency
  week_day?: number | null
  month_day?: number | null
}