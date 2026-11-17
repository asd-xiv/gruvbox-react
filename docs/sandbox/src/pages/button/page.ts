import { ButtonAsLink } from "./as-link.js"
import asLinkSource from "./as-link.tsx?raw"
import { ButtonSizes } from "./sizes.js"
import sizesSource from "./sizes.tsx?raw"
import { ButtonVariants } from "./variants.js"
import variantsSource from "./variants.tsx?raw"
import buttonSource from "../../../../../src/ui/button/button.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

const buttonPage: ComponentPage = {
  slug: "button",
  title: "Button",
  summary: findCommentSummary(buttonSource, "Button"),
  examples: [
    { title: "Variants", Example: ButtonVariants, source: variantsSource },
    { title: "Sizes", Example: ButtonSizes, source: sizesSource },
    { title: "As a link", Example: ButtonAsLink, source: asLinkSource },
  ],
  props: findTypeSource(buttonSource, [
    "ButtonVariant",
    "ButtonSize",
    "ButtonProps",
  ]),
}

export { buttonPage }
