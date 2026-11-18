import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { ColorSchemeSwitchExample } from "./switch.tsx"
import switchExampleSource from "./switch.tsx?raw"
import rootSource from "../../../../../src/ui/color-scheme/root.tsx?raw"
import switchSource from "../../../../../src/ui/color-scheme/switch.tsx?raw"

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
