import { deepStrictEqual, strictEqual } from "node:assert"
import { afterEach, describe, mock, test } from "node:test"
import { cleanup, renderHook } from "@testing-library/react"

import { useDomEventsListener } from "./listener_hook.js"

void describe("hooks/dom-events/listener_hook :: useDomEventsListener :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [an event] should [call its handler with the detail]", () => {
    const handler = mock.fn<(payload: unknown) => void>()

    renderHook(() => {
      useDomEventsListener({ "gvb-test": handler })
    })
    window.dispatchEvent(
      new window.CustomEvent("gvb-test", { detail: { id: 1 } })
    )

    deepStrictEqual(
      handler.mock.calls.map(call => call.arguments),
      [[{ id: 1 }]]
    )
  })

  void test("given [a new handlers object on each render] should [add the listener once]", () => {
    const addEventListener = mock.method(window, "addEventListener")
    const { rerender } = renderHook(() => {
      useDomEventsListener({ "gvb-test": mock.fn() })
    })

    rerender()
    rerender()

    const testListenerCount = addEventListener.mock.calls.filter(
      call => call.arguments[0] === "gvb-test"
    ).length
    addEventListener.mock.restore()

    strictEqual(testListenerCount, 1)
  })

  void test("given [a new handler] should [call only the new one]", () => {
    const firstHandler = mock.fn()
    const secondHandler = mock.fn()
    const { rerender } = renderHook(
      ({ handler }) => {
        useDomEventsListener({ "gvb-test": handler })
      },
      { initialProps: { handler: firstHandler } }
    )

    rerender({ handler: secondHandler })
    window.dispatchEvent(new window.Event("gvb-test"))

    strictEqual(firstHandler.mock.callCount(), 0)
    strictEqual(secondHandler.mock.callCount(), 1)
  })
})
