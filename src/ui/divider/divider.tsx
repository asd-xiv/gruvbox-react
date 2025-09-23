import type { FC } from "react"

import css from "./divider.module.css"
import { cn } from "../../utils/cn.js"

/**
 * Props for customizing the Divider component appearance
 */
type DividerProps = {
  /**
   * Sets the visual style of the divider
   * - ghost: No lines, just distancer
   * - simple: Standard single line
   * - double: Parallel lines
   * - ascii: Text-based separator using asterisks
   *
   * @default "simple"
   */
  variant?: "ghost" | "simple" | "double" | "ascii"

  /**
   * Controls vertical margin around the divider
   * - sm: Compact spacing (16px)
   * - normal: Standard spacing (24px)
   * - lg: Generous spacing (32px)
   *
   * @default "normal"
   */
  size?: "sm" | "normal" | "lg"

  /**
   * Sets the divider line weight
   * - normal: 1px line
   * - thick: 2px line
   *
   * @default "normal"
   */
  thickness?: "normal" | "thick"
}

/**
 * Renders a horizontal divider with customizable appearance
 *
 * @example
 * ```tsx
 * // Simple divider with default settings
 * <Divider />
 *
 * // Double-line divider with large spacing
 * <Divider variant="double" size="lg" />
 *
 * // ASCII-style divider with thick lines
 * <Divider variant="ascii" thickness="thick" />
 * ```
 */
const Divider: FC<DividerProps> = ({
  variant = "simple",
  size = "normal",
  thickness = "normal",
}) => {
  const dividerClasses = cn(
    css["dividerBase"],
    css[`variant-${variant}`],
    css[`size-${size}`],
    css[`thickness-${thickness}`]
  )

  return (
    <div className={dividerClasses} role="separator">
      {variant === "ascii" && "***"}
    </div>
  )
}

Divider.displayName = "GruvboxDivider"

export { Divider }
export type { DividerProps }
