import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { CalloutCustomTitle } from "./custom-title.tsx"
import customTitleSource from "./custom-title.tsx?raw"
import { CalloutVariants } from "./variants.tsx"
import variantsSource from "./variants.tsx?raw"
import calloutSource from "../../../../../src/ui/callout/callout.tsx?raw"

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
