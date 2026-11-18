import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { CardWithTitle } from "./with-title.tsx"
import withTitleSource from "./with-title.tsx?raw"
import cardSource from "../../../../../src/ui/card/card.tsx?raw"

const cardPage: ComponentPage = {
  slug: "card",
  title: "Card",
  summary: findCommentSummary(cardSource, "Card"),
  examples: [
    { title: "With a title", Example: CardWithTitle, source: withTitleSource },
  ],
  props: findTypeSource(cardSource, ["CardProps"]),
}

export { cardPage }
