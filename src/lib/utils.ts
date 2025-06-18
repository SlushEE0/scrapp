import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPbDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    dateStyle: "long"
  });
}
// Helper functions

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function getBadgeStatusStyles(
  value: number,
  cutoff: number,
  middleRemove: number
) {
  const MEETS_TIME = cutoff;
  const APPROACHING_TIME = cutoff - middleRemove;

  let className = "bg-destructive/20 text-destructive";

  if (value >= MEETS_TIME) {
    className = "bg-green-500/20 text-green-500";
  } else if (value >= APPROACHING_TIME) {
    className = "bg-amber-500/20 text-amber-500";
  }

  return className;
}
