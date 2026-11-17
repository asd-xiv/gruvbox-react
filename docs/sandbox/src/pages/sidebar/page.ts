import layoutSource from "./layout.tsx?raw"
import sidebarSource from "../../../../../src/ui/sidebar/sidebar.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

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
