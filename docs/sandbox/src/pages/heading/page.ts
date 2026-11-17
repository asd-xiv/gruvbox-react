import { HeadingLevels } from "./levels.js"
import levelsSource from "./levels.tsx?raw"
import headingSource from "../../../../../src/ui/heading/heading.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

const headingPage: ComponentPage = {
  slug: "heading",
  title: "Heading",
  summary: findCommentSummary(headingSource, "Heading"),
  examples: [{ title: "Levels", Example: HeadingLevels, source: levelsSource }],
  props: findTypeSource(headingSource, ["HeadingLevel", "HeadingProps"]),
}

export { headingPage }
