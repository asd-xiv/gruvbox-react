/* eslint-disable react/forbid-dom-props --
   The title id names the note through aria-labelledby */

import { useId } from "react"
import type { FC, ReactNode } from "react"

import css from "./callout.module.css"
import { icons } from "../../icons/nerd.js"
import { cn } from "../../utils/cn.js"

type CalloutVariant = "note" | "tip" | "important" | "warning" | "caution"

const VARIANTS: Record<CalloutVariant, { icon: string; label: string }> = {
  note: { icon: icons.oct.info, label: "Note" },
  tip: { icon: icons.oct.lightbulb, label: "Tip" },
  important: { icon: icons.oct.report, label: "Important" },
  warning: { icon: icons.oct.alert, label: "Warning" },
  caution: { icon: icons.oct.stop, label: "Caution" },
}

type CalloutProps = {
  children: ReactNode
  /** Sets the icon, the accent color and the default title */
  variant?: CalloutVariant
  /** Replaces the default title of the variant */
  title?: string
  className?: string
}

/**
 * GitHub-style callout, eg. a note or a warning next to the text it is about.
 *
 * It is a `role="note"` named by its title. A static callout is never an
 * `alert`: screen readers would announce it as soon as the page loads.
 *
 * @example
 * ```tsx
 * <Callout variant="note">
 *   Highlights information that users should take into account.
 * </Callout>
 *
 * <Callout variant="warning" title="Custom Title">
 *   Critical content with a custom title.
 * </Callout>
 * ```
 */
const Callout: FC<CalloutProps> = ({
  children,
  variant = "note",
  title,
  className,
}) => {
  const titleId = useId()

  return (
    <div
      className={cn(css["base"], css[`variant-${variant}`], className)}
      role="note"
      aria-labelledby={titleId}>
      <div className={css["header"]}>
        <span className={css["icon"]} aria-hidden="true">
          {VARIANTS[variant].icon}
        </span>
        <p className={css["title"]} id={titleId}>
          {title ?? VARIANTS[variant].label}
        </p>
      </div>
      <div className={css["content"]}>{children}</div>
    </div>
  )
}

Callout.displayName = "GruvboxCallout"

export { Callout }
export type { CalloutProps, CalloutVariant }
