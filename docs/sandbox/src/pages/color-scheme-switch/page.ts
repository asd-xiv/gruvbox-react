import { ColorSchemeSwitchExample } from "./switch.js"
import switchExampleSource from "./switch.tsx?raw"
import rootSource from "../../../../../src/ui/color-scheme/root.tsx?raw"
import switchSource from "../../../../../src/ui/color-scheme/switch.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

const colorSchemeSwitchPage: ComponentPage = {
  slug: "color-scheme-switch",
  title: "ColorSchemeSwitch",
  summary: findCommentSummary(switchSource, "ColorSchemeSwitch"),
  examples: [
    {
      title: "Switch",
      Example: ColorSchemeSwitchExample,
      source: switchExampleSource,
    },
  ],
  props: [
    findTypeSource(switchSource, ["ColorSchemeSwitchProps"]),
    findTypeSource(rootSource, ["ColorSchemeRootProps"]),
  ].join("\n\n"),
}

export { colorSchemeSwitchPage }
