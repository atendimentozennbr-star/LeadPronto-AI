import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Thresholds for AI generation usage indicators (consumption-aware: high % = warning). */
export const USAGE_THRESHOLDS = {
  CRITICAL: 90, // ≥90% → red
  WARNING: 70,  // ≥70% → amber
} as const

/** Returns a Tailwind bg colour class for a usage percentage. */
export function usageColour(percent: number): string {
  if (percent >= USAGE_THRESHOLDS.CRITICAL) return "bg-red-500"
  if (percent >= USAGE_THRESHOLDS.WARNING) return "bg-[#F59E0B]"
  return "bg-[#16A34A]"
}
