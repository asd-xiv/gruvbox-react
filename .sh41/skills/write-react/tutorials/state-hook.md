# State hook

A hook to own one piece of React state for the component that calls it. Each
call owns its own copy. It is not a store that components share.

## Files

```text
src/hooks/selection/
├── hook.ts
├── hook.test.ts
└── utils/
    ├── selection.ts        # the reducer, pure
    └── selection.test.ts
```

## Literate style example

Each section adds one part of `useSelection`, a hook that selects and unselects
ids, eg. the rows of a table.

### 1. The call

```tsx
// in an app
const [selectedIds, { toggle, clear }] = useSelection()

<input
  type="checkbox"
  checked={selectedIds.includes(row.id)}
  onChange={() => toggle(row.id)}
/>
```

### 2. The reducer

````ts
// src/hooks/selection/utils/selection.ts
type SelectionAction =
  | { type: "toggle"; id: string }
  | { type: "replace"; ids: readonly string[] }
  | { type: "clear" }

/**
 * Compute the next selected ids from the current ones and an action.
 *
 * @example
 * ```ts
 * selectionReducer(["a"], { type: "toggle", id: "b" })
 * // => ["a", "b"]
 * ```
 */
const selectionReducer = (
  selectedIds: readonly string[],
  action: SelectionAction
): readonly string[] => {
  switch (action.type) {
    case "toggle": {
      return selectedIds.includes(action.id)
        ? selectedIds.filter(id => id !== action.id)
        : [...selectedIds, action.id]
    }

    case "replace": {
      // The only Set: it drops the repeated ids
      return [...new Set(action.ids)]
    }

    case "clear": {
      // The same array, so React skips the render
      return selectedIds.length === 0 ? selectedIds : []
    }
  }
}

export { selectionReducer }
export type { SelectionAction }
````

### 3. The hook

- Give the hook one concern
  - Bad: `useTodos()` loads the todos and selects them
  - Good: `useTodos()` loads the todos, `useSelection()` selects ids

````ts
// src/hooks/selection/hook.ts
import { useMemo, useReducer } from "react"

import { selectionReducer } from "./utils/selection.js"

type SelectionActions = {
  toggle: (id: string) => void
  replace: (ids: readonly string[]) => void
  clear: () => void
}

/**
 * Select and unselect ids, in the shape of `useState`.
 *
 * Each `useSelection` call owns its own selection, so two lists never share
 * one.
 *
 * @example
 * ```tsx
 * const TodoList = ({ todos }: { todos: Todo[] }) => {
 *   const [selectedIds, { toggle }] = useSelection()
 *
 *   return todos.map(todo => (
 *     <label key={todo.id}>
 *       <input
 *         type="checkbox"
 *         checked={selectedIds.includes(todo.id)}
 *         onChange={() => toggle(todo.id)}
 *       />
 *       {todo.title}
 *     </label>
 *   ))
 * }
 * ```
 */
const useSelection = (
  initialIds: readonly string[] = []
): readonly [readonly string[], SelectionActions] => {
  // The initial ids go through `replace` too, which drops the repeated ones
  const [selectedIds, dispatch] = useReducer(
    selectionReducer,
    initialIds,
    ids => selectionReducer([], { type: "replace", ids })
  )

  // `dispatch` never changes, so neither do the actions
  const actions = useMemo<SelectionActions>(
    () => ({
      toggle: id => {
        dispatch({ type: "toggle", id })
      },
      replace: ids => {
        dispatch({ type: "replace", ids })
      },
      clear: () => {
        dispatch({ type: "clear" })
      },
    }),
    []
  )

  return [selectedIds, actions]
}

export { useSelection }
export type { SelectionActions }
````

### 4. Tests

```ts
// src/hooks/selection/utils/selection.test.ts
import { deepStrictEqual, strictEqual } from "node:assert"
import { describe, test } from "node:test"

import { selectionReducer } from "./selection.js"

void describe("hooks/selection/utils/selection :: selectionReducer :: valid", () => {
  void test("given [a toggle of an id not selected] should [add it]", () => {
    deepStrictEqual(selectionReducer(["a"], { type: "toggle", id: "b" }), [
      "a",
      "b",
    ])
  })

  void test("given [a toggle of a selected id] should [remove it]", () => {
    deepStrictEqual(selectionReducer(["a", "b"], { type: "toggle", id: "a" }), [
      "b",
    ])
  })

  void test("given [a replace] should [select exactly those ids]", () => {
    deepStrictEqual(
      selectionReducer(["a"], { type: "replace", ids: ["b", "c"] }),
      ["b", "c"]
    )
  })

  void test("given [a clear] should [select nothing]", () => {
    deepStrictEqual(selectionReducer(["a"], { type: "clear" }), [])
  })
})

void describe("hooks/selection/utils/selection :: selectionReducer :: edge", () => {
  void test("given [a replace with a repeated id] should [select it once]", () => {
    deepStrictEqual(
      selectionReducer([], { type: "replace", ids: ["a", "a"] }),
      ["a"]
    )
  })

  void test("given [a clear of an empty selection] should [return the same array]", () => {
    const selectedIds: readonly string[] = []

    strictEqual(selectionReducer(selectedIds, { type: "clear" }), selectedIds)
  })

  void test("given [a toggle] should [leave the current array unchanged]", () => {
    const selectedIds = ["a"]

    selectionReducer(selectedIds, { type: "toggle", id: "b" })

    deepStrictEqual(selectedIds, ["a"])
  })
})
```

```ts
// src/hooks/selection/hook.test.ts
import { deepStrictEqual, strictEqual } from "node:assert"
import { afterEach, describe, test } from "node:test"
import { act, cleanup, renderHook } from "@testing-library/react"

import { useSelection } from "./hook.js"

void describe("hooks/selection :: useSelection :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [initial ids] should [select them]", () => {
    const { result } = renderHook(() => useSelection(["a"]))

    deepStrictEqual(result.current[0], ["a"])
  })

  void test("given [a toggle] should [select the id]", () => {
    const { result } = renderHook(() => useSelection())

    act(() => {
      result.current[1].toggle("a")
    })

    deepStrictEqual(result.current[0], ["a"])
  })

  void test("given [a new render] should [return the same actions]", () => {
    const { result, rerender } = renderHook(() => useSelection())
    const firstActions = result.current[1]

    act(() => {
      result.current[1].toggle("a")
    })
    rerender()

    strictEqual(result.current[1], firstActions)
  })
})

void describe("hooks/selection :: useSelection :: edge", () => {
  afterEach(cleanup)

  void test("given [a repeated initial id] should [select it once]", () => {
    const { result } = renderHook(() => useSelection(["a", "a"]))

    deepStrictEqual(result.current[0], ["a"])
  })
})
```
