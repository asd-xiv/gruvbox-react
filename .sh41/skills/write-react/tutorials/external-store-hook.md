# External-store hook

A hook to read, and maybe write, a source React does not own, eg. localStorage,
the URL, a media query or the online status. Every call reads the same source,
so every call returns the same value, without a context. It is not a hook that
owns React state.

## Files

```text
src/hooks/search-parameter/
├── hook.ts
├── hook.test.ts
└── utils/
    └── search-parameters.ts    # read, write and subscribe, with no React
```

## Literate style example

Each section adds one part of `useSearchParameter`, a hook that reads and writes
one search parameter of the URL. `useLocalState` in gruvbox-react has the same
shape, over localStorage.

### 1. The call

- In an app with a router, read the parameter with the router's hook instead.
  The router owns the URL. A `history.replaceState` call does not update the
  router's state

```tsx
// in an app
type Filter = "all" | "active" | "done"

const FILTER_PROPS: SearchParameterProps<Filter> = {
  isValid: (value): value is Filter =>
    value === "all" || value === "active" || value === "done",
  defaultValue: "all",
}

const [filter, setFilter] = useSearchParameter("filter", FILTER_PROPS)
```

### 2. Read

```ts
// src/hooks/search-parameter/utils/search-parameters.ts
/**
 * `writeSearchParameter` fires this event on each write. The browser fires
 * `popstate` on Back and Forward only, never on `history.replaceState`
 */
const UPDATE_EVENT = "gvb-search-parameters:update"

/**
 * Read one search parameter of the current URL. Return `undefined` when it is
 * missing.
 *
 * Two reads of one URL are equal under `Object.is`, so React can use the
 * string as a `useSyncExternalStore` snapshot.
 */
const readSearchParameter = (key: string): string | undefined =>
  new URLSearchParams(window.location.search).get(key) ?? undefined
```

### 3. Write

- Skip this step for a read-only source, eg. the online status
- The browser fires `storage` in the other tabs only. After a localStorage
  write, fire your own event for this tab, as `writeSearchParameter` does
- Create the event with `window`'s constructor: the tests run in jsdom, and
  jsdom rejects Node's own `Event`

````ts
/**
 * Write one search parameter of the current URL, then tell the listeners. Pass
 * `undefined` to remove it.
 *
 * It replaces the history entry, so Back leaves the page instead of undoing
 * each change.
 *
 * @example
 * ```ts
 * writeSearchParameter("filter", "done")
 * // location.search === "?filter=done"
 * ```
 */
const writeSearchParameter = (key: string, value: string | undefined) => {
  const url = new URL(window.location.href)

  if (value === undefined) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }

  window.history.replaceState(window.history.state, "", url)
  window.dispatchEvent(new window.Event(UPDATE_EVENT))
}
````

### 4. Subscribe

```ts
/**
 * Call `listener` on each change of the search parameters: a write here,
 * Back or Forward. Return a function that stops the calls.
 */
const subscribeToSearchParameters = (listener: () => void) => {
  window.addEventListener(UPDATE_EVENT, listener)
  window.addEventListener("popstate", listener)

  return () => {
    window.removeEventListener(UPDATE_EVENT, listener)
    window.removeEventListener("popstate", listener)
  }
}

export {
  readSearchParameter,
  subscribeToSearchParameters,
  writeSearchParameter,
}
```

### 5. The hook

- Without a default value, the server snapshot returns the value to render on
  the server, eg. `true` for the online status

````ts
// src/hooks/search-parameter/hook.ts
import { useCallback, useSyncExternalStore } from "react"

import {
  readSearchParameter,
  subscribeToSearchParameters,
  writeSearchParameter,
} from "./utils/search-parameters.js"

type SearchParameterProps<T extends string> = {
  /** Type predicate for the value of the parameter */
  isValid: (value: string) => value is T
  /** Value to return when the parameter is missing or `isValid` rejects it */
  defaultValue: T
}

/**
 * The server does not have a browser URL. Return `undefined`, so the hook
 * returns `defaultValue` until hydration finishes.
 */
const getServerSnapshot = () => undefined

/**
 * Read and write one search parameter of the URL, in the shape of `useState`.
 *
 * Every `useSearchParameter` call with the same `key` reads the same URL, so
 * all calls return one value without a React context. Back and Forward update
 * it.
 *
 * @example
 * ```tsx
 * type Filter = "all" | "active" | "done"
 *
 * const FILTER_PROPS: SearchParameterProps<Filter> = {
 *   isValid: (value): value is Filter =>
 *     value === "all" || value === "active" || value === "done",
 *   defaultValue: "all",
 * }
 *
 * const [filter, setFilter] = useSearchParameter("filter", FILTER_PROPS)
 * // => "done", on ?filter=done
 *
 * setFilter("active") // ?filter=active
 * setFilter(undefined) // no parameter, back to "all"
 * ```
 */
const useSearchParameter = <T extends string>(
  key: string,
  { isValid, defaultValue }: SearchParameterProps<T>
): readonly [T, (value: T | undefined) => void] => {
  // The raw string is the snapshot. It stays equal under `Object.is` until the
  // URL changes
  const snapshot = useSyncExternalStore(
    subscribeToSearchParameters,
    () => readSearchParameter(key),
    getServerSnapshot
  )

  const value =
    snapshot !== undefined && isValid(snapshot) ? snapshot : defaultValue

  const setValue = useCallback(
    (nextValue: T | undefined) => {
      writeSearchParameter(key, nextValue)
    },
    [key]
  )

  return [value, setValue]
}

export { useSearchParameter }
export type { SearchParameterProps }
````

### 6. Tests

```ts
// src/hooks/search-parameter/hook.test.ts
import { strictEqual } from "node:assert"
import { afterEach, beforeEach, describe, test } from "node:test"
import { act, cleanup, renderHook } from "@testing-library/react"

import { useSearchParameter } from "./hook.js"
import type { SearchParameterProps } from "./hook.js"

type Filter = "all" | "active" | "done"

const FILTER_PROPS: SearchParameterProps<Filter> = {
  isValid: (value): value is Filter =>
    value === "all" || value === "active" || value === "done",
  defaultValue: "all",
}

const renderFilter = () =>
  renderHook(() => useSearchParameter("filter", FILTER_PROPS))

void describe("hooks/search-parameter :: useSearchParameter :: valid", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/")
  })

  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [no parameter] should [return the default value]", () => {
    const { result } = renderFilter()

    strictEqual(result.current[0], "all")
  })

  void test("given [a valid parameter] should [return it]", () => {
    window.history.replaceState(null, "", "/?filter=done")

    const { result } = renderFilter()

    strictEqual(result.current[0], "done")
  })

  void test("given [a set value] should [write it to the URL and return it]", () => {
    const { result } = renderFilter()

    act(() => {
      result.current[1]("active")
    })

    strictEqual(result.current[0], "active")
    strictEqual(window.location.search, "?filter=active")
  })

  void test("given [undefined set] should [remove the parameter and return the default value]", () => {
    window.history.replaceState(null, "", "/?filter=done")
    const { result } = renderFilter()

    act(() => {
      result.current[1](undefined)
    })

    strictEqual(result.current[0], "all")
    strictEqual(window.location.search, "")
  })

  void test("given [two calls with one key] should [share the value]", () => {
    const first = renderFilter()
    const second = renderFilter()

    act(() => {
      first.result.current[1]("done")
    })

    strictEqual(second.result.current[0], "done")
  })

  void test("given [a step back or forward] should [return the new value]", () => {
    const { result } = renderFilter()

    act(() => {
      window.history.replaceState(null, "", "/?filter=active")
      window.dispatchEvent(new window.PopStateEvent("popstate"))
    })

    strictEqual(result.current[0], "active")
  })
})

void describe("hooks/search-parameter :: useSearchParameter :: edge", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/")
  })

  afterEach(cleanup)

  void test("given [a parameter isValid rejects] should [return the default value]", () => {
    window.history.replaceState(null, "", "/?filter=archived")

    const { result } = renderFilter()

    strictEqual(result.current[0], "all")
  })

  void test("given [other parameters] should [keep them on a write]", () => {
    window.history.replaceState(null, "", "/?page=2")
    const { result } = renderFilter()

    act(() => {
      result.current[1]("done")
    })

    strictEqual(window.location.search, "?page=2&filter=done")
  })
})
```
