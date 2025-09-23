import { renderHook, act } from "@testing-library/react"
import { useLocalState } from "./use-local-state.ts"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string | undefined> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      store[key] = undefined
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("useLocalState :: Sister hook to React's `useState` with Local Storage persistence", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("given [no initial value] should [return state as undefined]", () => {
    const { result } = renderHook(() => useLocalState("test-id"))
    expect(result.current[0]).toBe(undefined)
  })

  test("given [initial value] should [return initial value and persist to localStorage]", () => {
    const { result } = renderHook(() =>
      useLocalState("test-with-default", "initial")
    )

    expect(result.current[0]).toBe("initial")
    expect(localStorage.getItem("use-local-storage_test-with-default")).toBe(
      JSON.stringify({ _data: "initial" })
    )
  })

  test("given [existing localStorage data] should [return persisted value]", () => {
    // Pre-populate localStorage
    localStorage.setItem(
      "use-local-storage_existing",
      JSON.stringify({ _data: "persisted" })
    )

    const { result } = renderHook(() => useLocalState("existing", "default"))

    expect(result.current[0]).toBe("persisted")
  })

  test("given [state update] should [update localStorage]", () => {
    const { result } = renderHook(() => useLocalState<string>("updatable"))

    act(() => {
      result.current[1]("updated value")
    })

    expect(result.current[0]).toBe("updated value")
    expect(localStorage.getItem("use-local-storage_updatable")).toBe(
      JSON.stringify({ _data: "updated value" })
    )
  })

  test("given [corrupted localStorage data] should [fall back to default value]", () => {
    // Set invalid JSON
    localStorage.setItem("use-local-storage_corrupted", "invalid json")

    const { result } = renderHook(() => useLocalState("corrupted", "fallback"))

    expect(result.current[0]).toBe("fallback")
    expect(localStorage.getItem("use-local-storage_corrupted")).toBe(
      JSON.stringify({ _data: "fallback" })
    )
  })

  test("given [missing _data property] should [fall back to default value]", () => {
    // Set valid JSON but wrong structure
    localStorage.setItem(
      "use-local-storage_wrong-structure",
      JSON.stringify({ wrongKey: "value" })
    )

    const { result } = renderHook(() =>
      useLocalState("wrong-structure", "fallback")
    )

    expect(result.current[0]).toBe("fallback")
  })

  test("given [complex object] should [persist and restore correctly]", () => {
    const initialObject = {
      name: "test",
      nested: { value: 42 },
      array: [1, 2, 3],
    }

    const { result } = renderHook(() => useLocalState("complex", initialObject))

    expect(result.current[0]).toEqual(initialObject)

    const updatedObject = {
      name: "updated test",
      nested: { value: 100 },
      array: [4, 5, 6],
    }

    act(() => {
      result.current[1](updatedObject)
    })

    expect(result.current[0]).toEqual(updatedObject)
    expect(localStorage.getItem("use-local-storage_complex")).toBe(
      JSON.stringify({ _data: updatedObject })
    )
  })
})
