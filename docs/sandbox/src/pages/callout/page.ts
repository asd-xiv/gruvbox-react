import { CalloutCustomTitle } from "./custom-title.js"
import customTitleSource from "./custom-title.tsx?raw"
import { CalloutVariants } from "./variants.js"
import variantsSource from "./variants.tsx?raw"
import calloutSource from "../../../../../src/ui/callout/callout.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

const calloutPage: ComponentPage = {
  slug: "callout",
  title: "Callout",
  summary: findCommentSummary(calloutSource, "Callout"),
  examples: [
    { title: "Variants", Example: CalloutVariants, source: variantsSource },
    {
      title: "Custom title",
      Example: CalloutCustomTitle,
      source: customTitleSource,
    },
  ],
  props: findTypeSource(calloutSource, ["CalloutVariant", "CalloutProps"]),
}

export { calloutPage }
