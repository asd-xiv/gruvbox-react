import { strictEqual } from "node:assert"
import { afterEach, describe, test } from "node:test"
import { cleanup, render, screen } from "@testing-library/react"

import { Card } from "./card.js"

void describe("ui/card :: Card :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [a title] should [name the card with it]", () => {
    render(<Card title="Variants">Save</Card>)

    strictEqual(
      screen.getByRole("group", { name: "Variants" }).textContent,
      "VariantsSave"
    )
  })
})

void describe("ui/card :: Card :: edge", () => {
  afterEach(cleanup)

  void test("given [no title] should [render the content with no group]", () => {
    render(<Card>Save</Card>)

    strictEqual(screen.queryByRole("group"), null)
    strictEqual(screen.getByText("Save").textContent, "Save")
  })
})
