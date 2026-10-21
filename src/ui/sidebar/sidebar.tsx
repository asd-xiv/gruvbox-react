import { forwardRef } from "react"
import type { FC, ReactNode } from "react"

import css from "./sidebar.module.css"
import { cn } from "../../utils/cn.js"
import { Button } from "../button/button.js"
import type { ButtonProps } from "../button/button.js"

type SidebarPartProps = {
  children: ReactNode
  className?: string
}

type SidebarProps = SidebarPartProps & {
  /** Name of the sidebar for screen readers, eg. "Main" */
  "aria-label"?: string
}

/**
 * Static side panel, always open. It fills the page height and stays in place
 * while the page scrolls.
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <Sidebar aria-label="Main">
 *     <SidebarHeader>ontology</SidebarHeader>
 *     <SidebarContent>
 *       <SidebarGroup>
 *         <SidebarGroupLabel>Model</SidebarGroupLabel>
 *         <SidebarMenu>
 *           <SidebarMenuItem>
 *             <SidebarMenuButton isActive>Classes</SidebarMenuButton>
 *           </SidebarMenuItem>
 *         </SidebarMenu>
 *       </SidebarGroup>
 *     </SidebarContent>
 *     <SidebarFooter>
 *       <ColorSchemeSwitch />
 *     </SidebarFooter>
 *   </Sidebar>
 *   <main className="flex-1">…</main>
 * </div>
 * ```
 */
const Sidebar: FC<SidebarProps> = ({
  children,
  className,
  "aria-label": ariaLabel,
}) => (
  <aside className={cn(css["sidebar"], className)} aria-label={ariaLabel}>
    {children}
  </aside>
)

Sidebar.displayName = "GruvboxSidebar"

/**
 * Top of the sidebar, eg. the app name.
 */
const SidebarHeader: FC<SidebarPartProps> = ({ children, className }) => (
  <div className={cn(css["header"], className)}>{children}</div>
)

SidebarHeader.displayName = "GruvboxSidebarHeader"

/**
 * Middle of the sidebar, the navigation landmark. It scrolls when the groups
 * are taller than the page.
 */
const SidebarContent: FC<SidebarPartProps> = ({ children, className }) => (
  <nav className={cn(css["content"], className)}>{children}</nav>
)

SidebarContent.displayName = "GruvboxSidebarContent"

/**
 * Bottom of the sidebar, eg. settings or the color scheme switch.
 */
const SidebarFooter: FC<SidebarPartProps> = ({ children, className }) => (
  <div className={cn(css["footer"], className)}>{children}</div>
)

SidebarFooter.displayName = "GruvboxSidebarFooter"

/**
 * A labeled section of the sidebar content.
 */
const SidebarGroup: FC<SidebarPartProps> = ({ children, className }) => (
  <section className={cn(css["group"], className)}>{children}</section>
)

SidebarGroup.displayName = "GruvboxSidebarGroup"

const SidebarGroupLabel: FC<SidebarPartProps> = ({ children, className }) => (
  <h2 className={cn(css["group-label"], className)}>{children}</h2>
)

SidebarGroupLabel.displayName = "GruvboxSidebarGroupLabel"

const SidebarMenu: FC<SidebarPartProps> = ({ children, className }) => (
  <ul className={cn(css["menu"], className)}>{children}</ul>
)

SidebarMenu.displayName = "GruvboxSidebarMenu"

const SidebarMenuItem: FC<SidebarPartProps> = ({ children, className }) => (
  <li className={cn(css["menu-item"], className)}>{children}</li>
)

SidebarMenuItem.displayName = "GruvboxSidebarMenuItem"

type SidebarMenuButtonProps = Omit<ButtonProps, "variant" | "size"> & {
  /** Mark the item of the current page */
  isActive?: boolean
}

/**
 * One entry of a sidebar menu, a ghost `Button`. Pass `asChild` to render a
 * link. Render it inside `SidebarMenu`, whose styles it extends.
 *
 * @example
 * ```tsx
 * <SidebarMenuButton isActive>Classes</SidebarMenuButton>
 * <SidebarMenuButton asChild>
 *   <a href="#properties">Properties</a>
 * </SidebarMenuButton>
 * ```
 */
const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive = false, ...props }, reference) => (
    <Button
      className={cn(css["menu-button"], className)}
      variant="ghost"
      size="sm"
      aria-current={isActive ? "page" : undefined}
      ref={reference}
      {...props}
    />
  )
)

SidebarMenuButton.displayName = "GruvboxSidebarMenuButton"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}
export type { SidebarProps, SidebarPartProps, SidebarMenuButtonProps }
