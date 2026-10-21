/**
 * Join the class names that are set, and skip `false` and `undefined`.
 *
 * @example
 * ```tsx
 * cn(css["base"], isActive && css["active"], className)
 * // => "base active"
 * ```
 */
const cn = (...classNames: (string | false | undefined)[]) =>
  classNames.filter(Boolean).join(" ")

export { cn }
