import {
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
import type { ReactNode } from "react"

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex">
    <Sidebar aria-label="Main">
      <SidebarHeader>ontology</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Model</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={true} render={<a href="#classes" />}>
                Classes
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="#properties" />}>
                Properties
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ColorSchemeSwitch />
      </SidebarFooter>
    </Sidebar>
    <main className="flex-1">{children}</main>
  </div>
)

export { AppLayout }
