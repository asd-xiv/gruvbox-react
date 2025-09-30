import { strictEqual, deepStrictEqual } from "node:assert"
import { describe, test, beforeEach } from "node:test"
import { renderHook, act } from "@testing-library/react"
import { useLocalState } from "./use-local-state.js"

void describe("useLocalState :: Sister hook to React's `useState` with Local Storage persistence", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  void test("given [no initial value] should [return state as undefined]", () => {
    const { result } = renderHook(() => useLocalState("test-id"))
    strictEqual(result.current[0], undefined)
  })

  void test("given [initial value] should [return initial value and persist to localStorage]", () => {
    const { result } = renderHook(() =>
      useLocalState("test-with-default", "initial")
    )

    strictEqual(result.current[0], "initial")
    strictEqual(
      localStorage.getItem("use-local-storage_test-with-default"),
      JSON.stringify({ _data: "initial" })
    )
  })

  void test("given [existing localStorage data] should [return persisted value]", () => {
    // Pre-populate localStorage
    localStorage.setItem(
      "use-local-storage_existing",
      JSON.stringify({ _data: "persisted" })
    )

    const { result } = renderHook(() => useLocalState("existing", "default"))

    strictEqual(result.current[0], "persisted")
  })

  void test("given [state update] should [update localStorage]", () => {
    const { result } = renderHook(() => useLocalState<string>("updatable"))

    act(() => {
      result.current[1]("updated value")
    })

    strictEqual(result.current[0], "updated value")
    strictEqual(
      localStorage.getItem("use-local-storage_updatable"),
      JSON.stringify({ _data: "updated value" })
    )
  })

  void test("given [corrupted localStorage data] should [fall back to default value]", () => {
    // Set invalid JSON
    localStorage.setItem("use-local-storage_corrupted", "invalid json")

    const { result } = renderHook(() => useLocalState("corrupted", "fallback"))

    strictEqual(result.current[0], "fallback")
    strictEqual(
      localStorage.getItem("use-local-storage_corrupted"),
      JSON.stringify({ _data: "fallback" })
    )
  })

  void test("given [missing _data property] should [fall back to default value]", () => {
    // Set valid JSON but wrong structure
    localStorage.setItem(
      "use-local-storage_wrong-structure",
      JSON.stringify({ wrongKey: "value" })
    )

    const { result } = renderHook(() =>
      useLocalState("wrong-structure", "fallback")
    )

    strictEqual(result.current[0], "fallback")
  })

  void test("given [complex object] should [persist and restore correctly]", () => {
    const initialObject = {
      name: "test",
      nested: { value: 42 },
      array: [1, 2, 3],
    }

    const { result } = renderHook(() => useLocalState("complex", initialObject))

    deepStrictEqual(result.current[0], initialObject)

    const updatedObject = {
      name: "updated test",
      nested: { value: 100 },
      array: [4, 5, 6],
    }

    act(() => {
      result.current[1](updatedObject)
    })

    deepStrictEqual(result.current[0], updatedObject)
    strictEqual(
      localStorage.getItem("use-local-storage_complex"),
      JSON.stringify({ _data: updatedObject })
    )
  })
})
