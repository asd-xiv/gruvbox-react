import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { TriStateSwitchTextSize } from "./text-size.tsx"
import textSizeSource from "./text-size.tsx?raw"
import triStateSwitchSource from "../../../../../src/ui/tri-state-switch/tri-state-switch.tsx?raw"

const triStateSwitchPage: ComponentPage = {
  slug: "tri-state-switch",
  title: "TriStateSwitch",
  summary: findCommentSummary(triStateSwitchSource, "TriStateSwitch"),
  examples: [
    {
      title: "Text size",
      Example: TriStateSwitchTextSize,
      source: textSizeSource,
    },
  ],
  props: findTypeSource(triStateSwitchSource, [
    "TriStateSwitchOption",
    "TriStateSwitchProps",
  ]),
}

export { triStateSwitchPage }
