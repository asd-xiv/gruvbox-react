import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { FC } from "react"

import css from "./button.module.css"
import { cn } from "../../utils/cn.js"

type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

type ButtonSize = "default" | "sm" | "lg" | "icon"

/**
 * Props for the Button component.
 */
type ButtonProps = useRender.ComponentProps<"button"> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * Button component with multiple variants and sizes. Pass `render` to draw
 * another element, eg. a link, in the look of a button.
 *
 * @example
 * <Button variant="destructive" size="sm">Delete</Button>
 * <Button render={<a href="/link" />}>Link styled as Button</Button>
 */
const Button: FC<ButtonProps> = ({
  ref,
  render,
  className,
  variant = "default",
  size = "default",
  ...props
}) =>
  useRender({
    defaultTagName: "button",
    render,
    ref,
    props: mergeProps<"button">(
      {
        className: cn(
          css["base"],
          css[`variant-${variant}`],
          css[`size-${size}`],
          className
        ),
        // A rendered element, eg. a link, takes no button type
        type: render ? undefined : "button",
      },
      props
    ),
  })

Button.displayName = "GruvboxButton"

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
