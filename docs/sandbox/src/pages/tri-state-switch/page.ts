import { TriStateSwitchTextSize } from "./text-size.js"
import textSizeSource from "./text-size.tsx?raw"
import triStateSwitchSource from "../../../../../src/ui/tri-state-switch/tri-state-switch.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

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
