import { buttonPage } from "./pages/button/page.js"
import { calloutPage } from "./pages/callout/page.js"
import { cardPage } from "./pages/card/page.js"
import { codeBlockPage } from "./pages/code-block/page.js"
import { colorSchemeSwitchPage } from "./pages/color-scheme-switch/page.js"
import { headingPage } from "./pages/heading/page.js"
import { sidebarPage } from "./pages/sidebar/page.js"
import { triStateSwitchPage } from "./pages/tri-state-switch/page.js"
import type { ComponentPage } from "./ui/component-page-view.js"

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

export { PAGES }
