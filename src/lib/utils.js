import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper for combining Tailwind CSS classes safely.
// clsx merges class name inputs and twMerge removes duplicate Tailwind utilities.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Quick boolean flag that detects iframe embedding.
export const isIframe = window.self !== window.top;
