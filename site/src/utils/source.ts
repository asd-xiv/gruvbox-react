type FencedCode = {
  language: string
  code: string
}

/**
 * Find the declarations of the named types in a source file, each with its
 * JSDoc, in the order of `names`. A declaration ends at the first blank line.
 *
 * @example
 * findTypeSource("type Size = 1 | 2\n\nconst size = 1", ["Size"])
 * // => "type Size = 1 | 2"
 */
const findTypeSource = (source: string, names: readonly string[]): string => {
  const blocks = source.split(/\n[ \t]*\n/)

  return names
    .map(name =>
      blocks.find(block =>
        block
          .split("\n")
          .some(
            line =>
              line.startsWith(`type ${name} `) ||
              line.startsWith(`type ${name}<`)
          )
      )
    )
    .filter(block => block !== undefined)
    .join("\n\n")
}

/**
 * Find the summary of the comment above a `const`: its text up to the first
 * blank line or tag, on one line.
 *
 * @example
 * findCommentSummary(buttonSource, "Button")
 * // => "Button component with multiple variants and sizes. …"
 */
const findCommentSummary = (source: string, name: string): string => {
  const lines = source.split("\n")
  const declarationIndex = lines.findIndex(
    line =>
      line.startsWith(`const ${name}:`) || line.startsWith(`const ${name} =`)
  )

  if (lines[declarationIndex - 1] !== " */") {
    return ""
  }

  const commentStartIndex = lines.lastIndexOf("/**", declarationIndex)
  const summaryLines: string[] = []

  for (const line of lines.slice(commentStartIndex + 1, declarationIndex - 1)) {
    const text = line.replace(/^ \* ?/, "")

    if (text === "" || text.startsWith("@")) {
      break
    }

    summaryLines.push(text)
  }

  return summaryLines.join(" ")
}

/**
 * Find the fenced code blocks of a Markdown section, from its heading to the
 * next heading of the same level.
 *
 * @example
 * findFencedCodes("## Install\n\n```sh\nnpm i\n```\n\n## Use", "## Install")
 * // => [{ language: "sh", code: "npm i" }]
 */
const findFencedCodes = (markdown: string, heading: string): FencedCode[] => {
  const headingStart = markdown.indexOf(`\n${heading}\n`)

  if (headingStart === -1) {
    return []
  }

  const level = heading.slice(0, heading.indexOf(" "))
  const rest = markdown.slice(headingStart + heading.length + 2)
  const nextHeadingStart = rest.indexOf(`\n${level} `)
  const section =
    nextHeadingStart === -1 ? rest : rest.slice(0, nextHeadingStart)

  return [...section.matchAll(/^```(\w*)\n([\s\S]*?)\n```$/gm)].map(
    ([, language = "", code = ""]) => ({ language, code })
  )
}

export { findTypeSource, findCommentSummary, findFencedCodes }
export type { FencedCode }
