/* eslint-disable react/forbid-dom-props --
   The id links the title to the card */

import { useId } from "react"
import type { FC, ReactNode } from "react"

import css from "./card.module.css"
import { cn } from "../../utils/cn.js"

type CardProps = {
  children: ReactNode
  className?: string
  /** Short label in the title bar, eg. "Variants". Screen readers read it as the card's name */
  title?: string
}

/**
 * Box with a border, the shadow and an optional title bar, eg. around an
 * example.
 *
 * @example
 * <Card title="Variants">
 *   <Button>Save</Button>
 * </Card>
 */
const Card: FC<CardProps> = ({ children, className, title }) => {
  const titleId = useId()

  return (
    <div
      className={cn(css["base"], className)}
      role={title ? "group" : undefined}
      aria-labelledby={title ? titleId : undefined}>
      {title && (
        <div className={css["title"]} id={titleId}>
          {title}
        </div>
      )}
      <div className={css["content"]}>{children}</div>
    </div>
  )
}

Card.displayName = "GruvboxCard"

export { Card }
export type { CardProps }
