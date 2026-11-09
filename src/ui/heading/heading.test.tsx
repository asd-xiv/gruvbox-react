import { strictEqual } from "node:assert"
import { afterEach, describe, test } from "node:test"
import { cleanup, render, screen } from "@testing-library/react"

import { Heading } from "./heading.js"

void describe("ui/heading :: Heading :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [a level] should [render the heading of that rank]", () => {
    render(<Heading level={2}>Props</Heading>)

    strictEqual(
      screen.getByRole("heading", { level: 2, name: "Props" }).tagName,
      "H2"
    )
  })

  void test("given [an id] should [set it on the heading]", () => {
    render(
      <Heading level={1} id="button">
        Button
      </Heading>
    )

    strictEqual(screen.getByRole("heading", { name: "Button" }).id, "button")
  })
})
