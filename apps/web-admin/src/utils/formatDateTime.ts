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

export function formatTime2(value: string | Date) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "-";
  return format(date, "HH:mm");
}

export function formatDateOnly(date?: Date): string | undefined {
  if (!date) return undefined;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มที่ 0
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
