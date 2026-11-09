import { CodeBlockLanguages } from "./languages.js"
import languagesSource from "./languages.tsx?raw"
import codeBlockSource from "../../../../src/ui/code-block/code-block.tsx?raw"
import type { ComponentPage } from "../../ui/component-page-view.js"
import { findCommentSummary, findTypeSource } from "../../utils/source.js"

const codeBlockPage: ComponentPage = {
  slug: "code-block",
  title: "CodeBlock",
  summary: findCommentSummary(codeBlockSource, "CodeBlock"),
  examples: [
    {
      title: "Languages",
      Example: CodeBlockLanguages,
      source: languagesSource,
    },
  ],
  props: findTypeSource(codeBlockSource, ["CodeLanguage", "CodeBlockProps"]),
}

export { codeBlockPage }
