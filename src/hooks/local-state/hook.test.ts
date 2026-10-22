import { deepStrictEqual, strictEqual } from "node:assert"
import { afterEach, beforeEach, describe, test } from "node:test"
import { act, cleanup, renderHook } from "@testing-library/react"

import { useLocalState } from "./hook.js"

const KEY = "settings"

type Settings = { language: string }

const isSettings = (value: unknown): value is Settings =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Settings).language === "string"

// A module constant, so `isValid` and `defaultValue` keep their identity
const SETTINGS_PROPS = {
  isValid: isSettings,
  defaultValue: { language: "en" },
}

const renderSettings = () =>
  renderHook(() => useLocalState(KEY, SETTINGS_PROPS))

void describe("useLocalState :: useState kept in localStorage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // node:test has no global afterEach for @testing-library to hook into
  afterEach(cleanup)

  void test("given [nothing stored] should [return the default value and write nothing]", () => {
    const { result } = renderSettings()

    deepStrictEqual(result.current[0], { language: "en" })
    strictEqual(localStorage.getItem(KEY), null)
  })

  void test("given [a valid value in storage] should [return it]", () => {
    localStorage.setItem(KEY, JSON.stringify({ language: "ro" }))

    const { result } = renderSettings()

    deepStrictEqual(result.current[0], { language: "ro" })
  })

  void test("given [a set value] should [store it as JSON and return it]", () => {
    const { result } = renderSettings()

    act(() => {
      result.current[1]({ language: "nl" })
    })

    deepStrictEqual(result.current[0], { language: "nl" })
    strictEqual(localStorage.getItem(KEY), JSON.stringify({ language: "nl" }))
  })

  void test("given [undefined set] should [drop the key and return the default value]", () => {
    localStorage.setItem(KEY, JSON.stringify({ language: "ro" }))
    const { result } = renderSettings()

    act(() => {
      result.current[1](undefined)
    })

    deepStrictEqual(result.current[0], { language: "en" })
    strictEqual(localStorage.getItem(KEY), null)
  })

  void test("given [two hooks with one key] should [share the value]", () => {
    const first = renderSettings()
    const second = renderSettings()

    act(() => {
      first.result.current[1]({ language: "nl" })
    })

    deepStrictEqual(second.result.current[0], { language: "nl" })
  })

  void test("given [a write in another tab] should [return the new value]", () => {
    const { result } = renderSettings()

    act(() => {
      localStorage.setItem(KEY, JSON.stringify({ language: "de" }))
      window.dispatchEvent(new window.StorageEvent("storage", { key: KEY }))
    })

    deepStrictEqual(result.current[0], { language: "de" })
  })

  void test("given [another tab clearing localStorage] should [return the default value]", () => {
    localStorage.setItem(KEY, JSON.stringify({ language: "ro" }))
    const { result } = renderSettings()

    act(() => {
      localStorage.clear()
      window.dispatchEvent(new window.StorageEvent("storage", { key: null }))
    })

    deepStrictEqual(result.current[0], { language: "en" })
  })

  void test("given [a new key with the same stored string] should [return the new key's default value]", () => {
    const { result, rerender } = renderHook(
      ({ key }: { key: string }) =>
        useLocalState(key, {
          isValid: isSettings,
          defaultValue: { language: key === "first" ? "en" : "nl" },
        }),
      { initialProps: { key: "first" } }
    )

    rerender({ key: "second" })

    deepStrictEqual(result.current[0], { language: "nl" })
  })

  void test("given [a re-render with no new write] should [return the same value object]", () => {
    localStorage.setItem(KEY, JSON.stringify({ language: "ro" }))
    const { result, rerender } = renderSettings()
    const firstValue = result.current[0]

    rerender()

    strictEqual(result.current[0], firstValue)
  })
})
