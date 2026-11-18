import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { HeadingLevels } from "./levels.tsx"
import levelsSource from "./levels.tsx?raw"
import headingSource from "../../../../../src/ui/heading/heading.tsx?raw"

const headingPage: ComponentPage = {
  slug: "heading",
  title: "Heading",
  summary: findCommentSummary(headingSource, "Heading"),
  examples: [{ title: "Levels", Example: HeadingLevels, source: levelsSource }],
  props: findTypeSource(headingSource, ["HeadingLevel", "HeadingProps"]),
}

export { headingPage }
