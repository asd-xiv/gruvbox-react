import { ok, strictEqual } from "node:assert"
import { afterEach, describe, test } from "node:test"
import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"

import { Button } from "./button.js"

void describe("ui/button :: Button :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [a label] should [render a button of type button]", () => {
    render(<Button>Save</Button>)

    strictEqual(
      screen.getByRole("button", { name: "Save" }).getAttribute("type"),
      "button"
    )
  })

  void test("given [a variant and a size] should [add their classes]", () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    )

    const { classList } = screen.getByRole("button", { name: "Delete" })

    ok(classList.contains("base"))
    ok(classList.contains("variant-destructive"))
    ok(classList.contains("size-sm"))
  })

  void test("given [a link in render] should [draw the link in the look of a button]", () => {
    render(<Button render={<a href="/docs" />}>Docs</Button>)

    const link = screen.getByRole("link", { name: "Docs" })

    strictEqual(link.getAttribute("href"), "/docs")
    strictEqual(link.getAttribute("type"), null)
    ok(link.classList.contains("variant-default"))
  })

  void test("given [a ref] should [point it at the button]", () => {
    const ref = createRef<HTMLButtonElement>()

    render(<Button ref={ref}>Save</Button>)

    strictEqual(ref.current, screen.getByRole("button", { name: "Save" }))
  })
})

void describe("ui/button :: Button :: edge", () => {
  afterEach(cleanup)

  void test("given [a type] should [keep it]", () => {
    render(<Button type="submit">Send</Button>)

    strictEqual(
      screen.getByRole("button", { name: "Send" }).getAttribute("type"),
      "submit"
    )
  })

  void test("given [a className] should [keep the classes of the variant]", () => {
    render(<Button className="ml-auto">Save</Button>)

    const { classList } = screen.getByRole("button", { name: "Save" })

    ok(classList.contains("ml-auto"))
    ok(classList.contains("variant-default"))
  })
})
