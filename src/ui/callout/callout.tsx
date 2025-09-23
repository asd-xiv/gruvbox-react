/* eslint-disable react/forbid-dom-props --
   Using ARIA attributes and roles for accessibility compliance */

import { useId } from "react"
import type { FC, PropsWithChildren } from "react"

import css from "./callout.module.css"
import { icons } from "../../icons/nerd.js"
import { cn } from "../../utils/cn.js"

/**
 * The variant of the callout, which determines the visual styling,
 * icon, default title, and ARIA role for accessibility.
 */
type CalloutVariant = "note" | "tip" | "important" | "warning" | "caution"

/**
 * Icons for each callout type using terminal-friendly icons from node-utils
 * Automatically handles Unicode support and fallbacks
 */
const calloutIcons: Record<CalloutVariant, string> = {
  note: icons.oct.info,
  tip: icons.oct.lightbulb,
  important: icons.oct.report,
  warning: icons.oct.alert,
  caution: icons.oct.stop,
} as const

/**
 * Labels for each callout type (uppercase as per GitHub style)
 */
const calloutLabels: Record<CalloutVariant, string> = {
  note: "NOTE",
  tip: "TIP",
  important: "IMPORTANT",
  warning: "WARNING",
  caution: "CAUTION",
} as const

/**
 * Props for the Callout component
 */
type CalloutProps = {
  /** The variant of the callout (determines icon, color, and default title) */
  variant?: CalloutVariant
  /** Optional custom title to override the default variant label */
  title?: string
}

/**
 * GitHub-style callout component for highlighting different types of information.
 *
 * Follows GitHub's callout syntax and styling with full accessibility support:
 * - **NOTE**: Highlights information users should consider (role="note")
 * - **TIP**: Optional information to help users succeed (role="note")
 * - **IMPORTANT**: Crucial information necessary for success (role="note")
 * - **WARNING**: Critical content demanding immediate attention (role="alert")
 * - **CAUTION**: Negative potential consequences of an action (role="alert")
 *
 * @example
 * ```tsx
 * <Callout variant="note">
 *   Highlights information that users should take into account, even when skimming.
 * </Callout>
 *
 * <Callout variant="warning" title="Custom Title">
 *   Critical content with custom title.
 * </Callout>
 * ```
 */
const Callout: FC<PropsWithChildren<CalloutProps>> = ({
  variant = "note",
  title,
  children,
}) => {
  const titleId = useId()
  const displayTitle = title || calloutLabels[variant]
  const icon = calloutIcons[variant]

  // Use 'alert' role for urgent callouts, 'note' for informational ones
  // This helps screen readers announce the appropriate level of importance
  const ariaSeverity =
    variant === "warning" || variant === "caution" ? "alert" : "note"

  return (
    <div
      role={ariaSeverity}
      className={cn(css["base"], css[`variant-${variant}`])}>
      <div className={css["header"]}>
        <span
          className={css["icon"]}
          role="img"
          aria-label={`${variant} indicator`}>
          {icon}
        </span>
        <h3 className={css["title"]} id={titleId}>
          {displayTitle}
        </h3>
      </div>
      <div className={css["content"]} aria-labelledby={titleId}>
        {children}
      </div>
    </div>
  )
}

Callout.displayName = "GruvboxCallout"

export { Callout }
export type { CalloutProps, CalloutVariant }
