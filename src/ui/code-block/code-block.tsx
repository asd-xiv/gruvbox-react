import { useEffect, useState } from "react"
import type { FC } from "react"
import { parse } from "sugar-high/core"
import type { ParseOptions } from "sugar-high/core"
import * as cssLanguage from "sugar-high/lang/css"
import * as diffLanguage from "sugar-high/lang/diff"
import * as jsonLanguage from "sugar-high/lang/json"
import * as shellLanguage from "sugar-high/lang/shell"
import * as typescriptLanguage from "sugar-high/lang/typescript"

import css from "./code-block.module.css"
import { cn } from "../../utils/cn.js"
import { Button } from "../button/button.js"

type CodeLanguage = "tsx" | "ts" | "jsx" | "js" | "css" | "json" | "sh" | "diff"

// The TypeScript config also reads JavaScript, JSX and TSX
const PARSE_OPTIONS_BY_LANGUAGE: Record<CodeLanguage, ParseOptions> = {
  tsx: typescriptLanguage,
  ts: typescriptLanguage,
  jsx: typescriptLanguage,
  js: typescriptLanguage,
  css: cssLanguage,
  json: jsonLanguage,
  sh: shellLanguage,
  diff: diffLanguage,
}

const COPIED_DURATION_MS = 2000

type CodeBlockProps = {
  /** The code, shown as written */
  children: string
  className?: string
  /**
   * Language of the code, for its colors and its label
   *
   * @default "tsx"
   */
  language?: CodeLanguage
  /** File name in the title bar, eg. "button.tsx" */
  title?: string
}

/**
 * Block of code with its colors, its language, and a button that copies it.
 * The `--gvb-code-*` tokens set the colors.
 *
 * @example
 * <CodeBlock language="tsx" title="save.tsx">
 *   {`<Button>Save</Button>`}
 * </CodeBlock>
 */
const CodeBlock: FC<CodeBlockProps> = ({
  children,
  className,
  language = "tsx",
  title,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const { lines } = parse(children, PARSE_OPTIONS_BY_LANGUAGE[language])

  useEffect(() => {
    if (!isCopied) {
      return
    }

    const timeout = setTimeout(() => {
      setIsCopied(false)
    }, COPIED_DURATION_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCopied])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setIsCopied(true)
  }

  return (
    <div className={cn(css["base"], className)}>
      <div className={css["header"]}>
        {title && <span className={css["title"]}>{title}</span>}
        <span className={css["language"]}>{language}</span>
        <Button
          className={css["copy"]}
          variant="ghost"
          size="sm"
          onClick={() => {
            void handleCopy()
          }}>
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className={css["code"]}>
        <code>
          {lines.map(line => (
            <span key={line.index}>
              {line.tokens.map((token, index) => (
                <span key={index} className={css[token.type]}>
                  {token.value}
                </span>
              ))}
              {line.index < lines.length - 1 && "\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

CodeBlock.displayName = "GruvboxCodeBlock"

export { CodeBlock }
export type { CodeBlockProps, CodeLanguage }
