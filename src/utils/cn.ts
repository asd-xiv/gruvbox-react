import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge.
 *
 * @example
 *
 * ```tsx
 * cn("px-2 py-1", {
 *   "bg-blue-500": true,
 *   "text-white": false
 * }, ["hover:bg-blue-600"])
 * // => 'px-2 py-1 bg-blue-500 hover:bg-blue-600'
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
