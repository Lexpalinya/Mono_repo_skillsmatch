import { format } from "date-fns";

export function formatDateTime(date: Date | string | undefined): string {
    if (!date) return "";
  return format(date, "M/d/yyyy, h:mm:ss a");
}

export function formatDate(date: Date | string): string {
  return format(date, "M/d/yyyy");
}

export function formatTime(date: Date | string): string {
  return format(date, "h:mm:ss a");
}
