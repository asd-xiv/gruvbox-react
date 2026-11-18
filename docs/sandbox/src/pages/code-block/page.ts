import type { ComponentPage } from "@self/ui/component-page-view.tsx"
import { findCommentSummary, findTypeSource } from "@self/utils/source.ts"
import { CodeBlockLanguages } from "./languages.tsx"
import languagesSource from "./languages.tsx?raw"
import codeBlockSource from "../../../../../src/ui/code-block/code-block.tsx?raw"

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
