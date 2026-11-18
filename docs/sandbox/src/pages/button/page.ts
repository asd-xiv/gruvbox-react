import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { ButtonAsLink } from "./as-link.tsx"
import asLinkSource from "./as-link.tsx?raw"
import { ButtonSizes } from "./sizes.tsx"
import sizesSource from "./sizes.tsx?raw"
import { ButtonVariants } from "./variants.tsx"
import variantsSource from "./variants.tsx?raw"
import buttonSource from "../../../../../src/ui/button/button.tsx?raw"

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
