import { Schedule, Frequency } from "@/lib/types/recurring-tasks"

export function getFrequencyDisplay(task: {
  frequency: Frequency;
  week_day: number | null;
  month_day: number | null;
}): string {
  switch (task.frequency) {
    case "daily":
      return "Daily"
    case "weekly":
      return task.week_day !== null
        ? `Weekly (${getWeekdayName(task.week_day)})`
        : "Weekly (Not set)"
    case "monthly":
      return task.month_day !== null
        ? `Monthly (Day ${task.month_day})`
        : "Monthly (Not set)"
    default:
      return task.frequency
  }
}

export function getWeekdayName(day: number): string {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  return weekdays[day] || "Invalid day"
}

export function validateSchedule(frequency: Frequency, weekDay?: number, monthDay?: number): boolean {
  switch (frequency) {
    case "weekly":
      return typeof weekDay === "number" && weekDay >= 0 && weekDay <= 6
    case "monthly":
      return typeof monthDay === "number" && monthDay >= 1 && monthDay <= 31
    case "daily":
      return true
    default:
      return false
  }
}