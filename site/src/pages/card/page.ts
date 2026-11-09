import { CardWithTitle } from "./with-title.js"
import withTitleSource from "./with-title.tsx?raw"
import cardSource from "../../../../src/ui/card/card.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

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
