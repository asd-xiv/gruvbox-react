import {
  Button,
  ColorSchemeRoot,
  ColorSchemeSwitch,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@asd14/gruvbox-react/ui"
import { ComponentPageView } from "@self/ui/component-page-view.tsx"
import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { useHash } from "@self/utils/use-hash.ts"
import { useEffect } from "react"

import css from "./index.app.module.css"
import { buttonPage } from "./pages/button/page.ts"
import { calloutPage } from "./pages/callout/page.ts"
import { cardPage } from "./pages/card/page.ts"
import { codeBlockPage } from "./pages/code-block/page.ts"
import { colorSchemeSwitchPage } from "./pages/color-scheme-switch/page.ts"
import { headingPage } from "./pages/heading/page.ts"
import { HomePage } from "./pages/home.tsx"
import { sidebarPage } from "./pages/sidebar/page.ts"
import { triStateSwitchPage } from "./pages/tri-state-switch/page.ts"

/**
 * The component pages, in the order of the sidebar
 */
const PAGES: readonly ComponentPage[] = [
  buttonPage,
  calloutPage,
  cardPage,
  codeBlockPage,
  colorSchemeSwitchPage,
  headingPage,
  sidebarPage,
  triStateSwitchPage,
]

/**
 * The docs site: a sidebar with one link per component, and the page of the
 * component the URL hash names, eg. `#button`.
 */
const App = () => {
  const hash = useHash()
  const page = PAGES.find(item => item.slug === hash)

  // A new page starts at its top
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [hash])

  return (
    <ColorSchemeRoot className={css["app"]}>
      <Sidebar aria-label="Components">
        <SidebarHeader>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- Base UI fills the anchor with the children */}
          <Button variant="ghost" render={<a href="#home" />}>
            gruvbox-react
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <SidebarMenu>
              {PAGES.map(item => (
                <SidebarMenuItem key={item.slug}>
                  <SidebarMenuButton
                    isActive={item.slug === hash}
                    // eslint-disable-next-line jsx-a11y/anchor-has-content -- Base UI fills the anchor with the children
                    render={<a href={`#${item.slug}`} />}>
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <ColorSchemeSwitch />
        </SidebarFooter>
      </Sidebar>
      <main className={css["main"]}>
        {page ? <ComponentPageView page={page} /> : <HomePage />}
      </main>
    </ColorSchemeRoot>
  )
}

export { App }
