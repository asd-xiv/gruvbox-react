import { deepStrictEqual, strictEqual } from "node:assert"
import { afterEach, describe, mock, test } from "node:test"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

import { CodeBlock } from "./code-block.js"

void describe("ui/code-block :: CodeBlock :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [code] should [show it as written]", () => {
    const code = "const answer = 42\n\n// the answer"
    const { container } = render(<CodeBlock>{code}</CodeBlock>)

    strictEqual(container.querySelector("code")?.textContent, code)
  })

  void test("given [a keyword] should [mark it with the keyword class]", () => {
    const { container } = render(<CodeBlock>const answer = 42</CodeBlock>)

    strictEqual(container.querySelector(".keyword")?.textContent, "const")
  })

  void test("given [a title and a language] should [show both in the title bar]", () => {
    render(
      <CodeBlock title="index.css" language="css">
        {"body { margin: 0 }"}
      </CodeBlock>
    )

    strictEqual(screen.getByText("index.css").textContent, "index.css")
    strictEqual(screen.getByText("css").textContent, "css")
  })

  void test("given [a click on Copy] should [copy the code and say Copied]", async () => {
    const writeText = mock.fn(async (_text: string) => {})
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })

    render(<CodeBlock>const answer = 42</CodeBlock>)
    fireEvent.click(screen.getByRole("button", { name: "Copy" }))

    await screen.findByRole("button", { name: "Copied" })
    deepStrictEqual(
      writeText.mock.calls.map(call => call.arguments),
      [["const answer = 42"]]
    )
  })
})
