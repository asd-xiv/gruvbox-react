import { clsx } from "clsx"
import type { ClassValue } from "clsx"

/**
 * Combines multiple class names using clsx.
 *
 * @example
 *
 * ```tsx
 * cn("flex items-center", {
 *   "bg-primary": true,
 *   "text-error": false
 * }, ["p-2"])
 * // => 'flex items-center bg-primary p-2'
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs)
}
