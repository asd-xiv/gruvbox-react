import {
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
import { useEffect } from "react"

import css from "./app.module.css"
import { HomePage } from "./pages/home.js"
import { PAGES } from "./pages.js"
import { ComponentPageView } from "./ui/component-page-view.js"
import { useHash } from "./utils/use-hash.js"

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
          <a className={css["home-link"]} href="#home">
            gruvbox-react
          </a>
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
