import { deepStrictEqual, strictEqual } from "node:assert"
import { describe, test } from "node:test"

import {
  findCommentSummary,
  findFencedCodes,
  findTypeSource,
} from "./source.js"

const SOURCE = [
  'type ButtonSize = "sm" | "lg"',
  "",
  "/**",
  " * Props for the Button component.",
  " */",
  "type ButtonProps = {",
  "  size?: ButtonSize",
  "}",
  "",
  "/**",
  " * Button with two sizes. Pass `size` to pick",
  " * one.",
  " *",
  " * @example",
  ' * <Button size="sm" />',
  " */",
  "const Button: FC<ButtonProps> = () => null",
].join("\n")

void describe("docs/sandbox/utils/source :: findTypeSource :: valid", () => {
  void test("given [two names] should [return both declarations, in the order of the names]", () => {
    strictEqual(
      findTypeSource(SOURCE, ["ButtonSize", "ButtonProps"]),
      [
        'type ButtonSize = "sm" | "lg"',
        "",
        "/**",
        " * Props for the Button component.",
        " */",
        "type ButtonProps = {",
        "  size?: ButtonSize",
        "}",
      ].join("\n")
    )
  })
})

void describe("docs/sandbox/utils/source :: findTypeSource :: edge", () => {
  void test("given [a missing name] should [skip it]", () => {
    strictEqual(
      findTypeSource(SOURCE, ["Missing", "ButtonSize"]),
      'type ButtonSize = "sm" | "lg"'
    )
  })

  void test("given [a generic type] should [find it]", () => {
    strictEqual(
      findTypeSource("type Box<T> = { value: T }", ["Box"]),
      "type Box<T> = { value: T }"
    )
  })
})

void describe("docs/sandbox/utils/source :: findCommentSummary :: valid", () => {
  void test("given [a comment above the const] should [return its text up to the first blank line, on one line]", () => {
    strictEqual(
      findCommentSummary(SOURCE, "Button"),
      "Button with two sizes. Pass `size` to pick one."
    )
  })
})

void describe("docs/sandbox/utils/source :: findCommentSummary :: edge", () => {
  void test("given [a const with no comment] should [return an empty string]", () => {
    strictEqual(findCommentSummary("const Button = () => null", "Button"), "")
  })
})

void describe("docs/sandbox/utils/source :: findFencedCodes :: valid", () => {
  void test("given [a section with two fences] should [return both, in order]", () => {
    const markdown = [
      "# Kit",
      "",
      "## Usage",
      "",
      "```css",
      '@import "kit";',
      "```",
      "",
      "```tsx",
      "<Button />",
      "```",
      "",
      "## License",
      "",
      "```text",
      "MIT",
      "```",
    ].join("\n")

    deepStrictEqual(findFencedCodes(markdown, "## Usage"), [
      { language: "css", code: '@import "kit";' },
      { language: "tsx", code: "<Button />" },
    ])
  })
})

void describe("docs/sandbox/utils/source :: findFencedCodes :: edge", () => {
  void test("given [a missing heading] should [return no fence]", () => {
    deepStrictEqual(findFencedCodes("# Kit\n\n## Usage\n", "## Install"), [])
  })
})
