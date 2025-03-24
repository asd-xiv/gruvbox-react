import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "../../utils/cn.js"

/**
 * Visual styles for different button types and sizes.
 */
const variants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Comprehensive props type for the Button component.
 * Combines HTML button attributes with variant props and child rendering option.
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants> & {
    /**
     * Allows rendering the button as a child component
     *
     * @default false
     */
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
  ({ className, variant, size, asChild = false, ...props }, reference) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(variants({ variant, size, className }))}
        ref={reference}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }
