import type { ComponentPropsWithoutRef, FC } from "react"

import css from "./heading.module.css"
import { cn } from "../../utils/cn.js"

type HeadingLevel = 1 | 2 | 3

type HeadingProps = ComponentPropsWithoutRef<"h1"> & {
  /** Rank of the heading, `1` renders an `h1` */
  level: HeadingLevel
}

/**
 * Title of a page or of a section, from `h1` to `h3`. It sets no margin: the
 * layout around it sets the space.
 *
 * @example
 * <Heading level={1}>Button</Heading>
 * <Heading level={2} id="props">Props</Heading>
 */
const Heading: FC<HeadingProps> = ({ level, className, ...props }) => {
  const Tag = `h${level}` as const

  return (
    <Tag
      className={cn(css["base"], css[`level-${level}`], className)}
      {...props}
    />
  )
}

Heading.displayName = "GruvboxHeading"

export { Heading }
export type { HeadingProps, HeadingLevel }
