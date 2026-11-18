import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import layoutSource from "./layout.tsx?raw"
import sidebarSource from "../../../../../src/ui/sidebar/sidebar.tsx?raw"

const sidebarPage: ComponentPage = {
  slug: "sidebar",
  title: "Sidebar",
  summary: findCommentSummary(sidebarSource, "Sidebar"),
  // The sidebar fills the page height, so this site's own sidebar shows it
  examples: [{ title: "Layout, as on the left", source: layoutSource }],
  props: findTypeSource(sidebarSource, [
    "SidebarPartProps",
    "SidebarProps",
    "SidebarMenuButtonProps",
  ]),
}

export { sidebarPage }
