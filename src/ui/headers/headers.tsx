import type { ReactNode, FC } from "react"

import css from "./headers.module.css"
import { cn } from "../../index.utils.js"

type HeaderProps = {
  children: ReactNode
  className?: string
}

/**
 * H1 Header component
 *
 * @example
 * ```tsx
 * <Header1>Main Title</Header1>
 * <Header1 className="text-center">Centered Title</Header1>
 * ```
 */
const Header1: FC<HeaderProps> = ({ children, className = "" }) => (
  <h1 className={cn(css["h1"], className)}>{children}</h1>
)

Header1.displayName = "GruvboxHeader1"

/**
 * H2 Header component
 *
 * @example
 * ```tsx
 * <Header2>Section Title</Header2>
 * ```
 */
const Header2: FC<HeaderProps> = ({ children, className = "" }) => (
  <h2 className={cn(css["h2"], className)}>{children}</h2>
)

Header2.displayName = "GruvboxHeader2"

/**
 * H3 Header component
 *
 * @example
 * ```tsx
 * <Header3>Subsection Title</Header3>
 * ```
 */
const Header3: FC<HeaderProps> = ({ children, className = "" }) => (
  <h3 className={cn(css["h3"], className)}>{children}</h3>
)

Header3.displayName = "GruvboxHeader3"

/**
 * H4 Header component
 *
 * @example
 * ```tsx
 * <Header4>Minor Section Title</Header4>
 * ```
 */
const Header4: FC<HeaderProps> = ({ children, className = "" }) => (
  <h4 className={cn(css["h4"], className)}>{children}</h4>
)

Header4.displayName = "GruvboxHeader4"

/**
 * H5 Header component
 *
 * @example
 * ```tsx
 * <Header5>Small Section Title</Header5>
 * ```
 */
const Header5: FC<HeaderProps> = ({ children, className = "" }) => (
  <h5 className={`${css["h5"]} ${className}`}>{children}</h5>
)

Header5.displayName = "GruvboxHeader5"

/**
 * H6 Header component
 *
 * @example
 * ```tsx
 * <Header6>Smallest Section Title</Header6>
 * ```
 */
const Header6: FC<HeaderProps> = ({ children, className = "" }) => (
  <h6 className={cn(css["h6"], className)}>{children}</h6>
)

Header6.displayName = "GruvboxHeader6"

export { Header1, Header2, Header3, Header4, Header5, Header6 }
export type { HeaderProps }
