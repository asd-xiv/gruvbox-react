import { CodeBlock, Heading } from "@asd14/gruvbox-react/ui"
import type { CodeLanguage } from "@asd14/gruvbox-react/ui"

import css from "@self/ui/page.module.css"
import { findFencedCodes } from "@self/utils/source.ts"
import packageSource from "../../../../package.json?raw"
import readmeSource from "../../../../README.md?raw"

const CODE_LANGUAGES: readonly string[] = [
  "tsx",
  "ts",
  "jsx",
  "js",
  "css",
  "json",
  "sh",
  "diff",
] satisfies readonly CodeLanguage[]

const isCodeLanguage = (value: string): value is CodeLanguage =>
  CODE_LANGUAGES.includes(value)

/**
 * The first page: what the kit is, and how to install and use it, copied from
 * `package.json` and the README.
 */
const HomePage = () => {
  const { description } = JSON.parse(packageSource) as { description: string }
  const [install] = findFencedCodes(readmeSource, "## Installation")
  const usage = findFencedCodes(readmeSource, "## Usage")

  return (
    <article className={css["page"]}>
      <header className={css["header"]}>
        <Heading level={1}>gruvbox-react</Heading>
        <p className={css["summary"]}>{description}</p>
      </header>
      <Heading level={2}>Install</Heading>
      {install && <CodeBlock language="sh">{install.code}</CodeBlock>}
      <Heading level={2}>Use</Heading>
      {usage.map(({ language, code }) => (
        <CodeBlock
          key={code}
          language={isCodeLanguage(language) ? language : "tsx"}>
          {code}
        </CodeBlock>
      ))}
    </article>
  )
}

export { HomePage }
