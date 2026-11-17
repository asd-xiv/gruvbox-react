import { Card, CodeBlock, Heading } from "@asd14/gruvbox-react/ui"
import type { FC } from "react"

import css from "./page.module.css"

type ComponentExample = {
  title: string
  /** The code of the example, as its file has it */
  source: string
  /** Renders the example. Without it, the page shows the code alone */
  Example?: FC
}

type ComponentPage = {
  slug: string
  title: string
  /** The summary of the comment above the component */
  summary: string
  examples: readonly ComponentExample[]
  /** The declarations of the component's props types */
  props: string
}

/**
 * Text with each part between backticks rendered as code, as in Markdown
 */
const InlineCode: FC<{ text: string }> = ({ text }) =>
  text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className={css["inline-code"]}>
        {part}
      </code>
    ) : (
      part
    )
  )

/**
 * The page of one component: its summary, its examples, each rendered and
 * shown as code, and its props types.
 */
const ComponentPageView: FC<{ page: ComponentPage }> = ({ page }) => (
  <article className={css["page"]}>
    <header className={css["header"]}>
      <Heading level={1}>{page.title}</Heading>
      <p className={css["summary"]}>
        <InlineCode text={page.summary} />
      </p>
    </header>
    <Heading level={2}>Examples</Heading>
    {page.examples.map(({ title, source, Example }) => (
      <section key={title} className={css["example"]}>
        {Example ? (
          <Card title={title}>
            <Example />
          </Card>
        ) : (
          <Heading level={3}>{title}</Heading>
        )}
        <CodeBlock>{source}</CodeBlock>
      </section>
    ))}
    <Heading level={2}>Props</Heading>
    <CodeBlock language="ts">{page.props}</CodeBlock>
  </article>
)

export { ComponentPageView }
export type { ComponentPage, ComponentExample }
