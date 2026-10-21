import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

import css from "./button.module.css"
import { cn } from "../../utils/cn.js"

type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

type ButtonSize = "default" | "sm" | "lg" | "icon"

/**
 * Props for the Button component.
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

/**
 * Button component with multiple variants and sizes.
 * Supports rendering as a native button or as a child component.
 *
 * @example
 * <Button variant="destructive" size="sm">Delete</Button>
 * <Button asChild>
 *   <a href="/link">Link styled as Button</a>
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      type = "button",
      ...props
    },
    reference
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          css["base"],
          css[`variant-${variant}`],
          css[`size-${size}`],
          className
        )}
        ref={reference}
        // A child, eg. a link, sets its own type
        type={asChild ? undefined : type}
        {...props}
      />
    )
  }
)

Button.displayName = "GruvboxButton"

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
