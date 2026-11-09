# Context provider

A provider to share state and actions with the components of one subtree, eg.
the todos that a page lists and the app header counts. It is not a store for the
whole app, nor a home for state that one component reads.

## Files

```text
src/features/todos/
├── context.ts            # the context and the type of its value
├── provider.tsx          # owns the state, the requests and their errors
├── hook.ts               # reads the context, guards the provider
├── ui/
│   ├── todos-count.tsx
│   ├── todos-page.tsx
│   └── todos-page.module.css
└── utils/
    ├── api.ts            # the adapter: requests, no React
    ├── reducer.ts        # pure
    └── reducer.test.ts
```

- `react-refresh/only-export-components` lets a `.tsx` file export components
  only, so the context and the hook live in `.ts` files

## Literate style example

Each section adds one part of the todos of an app: a page lists them, and the
app header counts the open ones.

### 1. The adapter

- Guard the response once, here. The backend can answer with anything. After
  this guard, the provider and the components use the todos without a check

````ts
// src/features/todos/utils/api.ts
type Todo = {
  id: string
  title: string
  isDone: boolean
}

const isTodo = (value: unknown): value is Todo =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Todo).id === "string" &&
  typeof (value as Todo).title === "string" &&
  typeof (value as Todo).isDone === "boolean"

/**
 * Find the todos of the backend.
 *
 * @throws {Error} When the backend fails
 * @throws {TypeError} When the backend answers with something other than todos
 *
 * @example
 * ```ts
 * await findTodos({ backendUrl: "https://api.acme.com" })
 * // => [{ id: "1", title: "Buy milk", isDone: false }]
 * ```
 */
const findTodos = async ({
  backendUrl,
}: {
  backendUrl: string
}): Promise<Todo[]> => {
  const response = await fetch(`${backendUrl}/todos`)

  if (!response.ok) {
    throw new Error(`GET /todos answered ${response.status}`)
  }

  const body: unknown = await response.json()

  if (!Array.isArray(body) || !body.every(isTodo)) {
    throw new TypeError("GET /todos answered something other than todos")
  }

  return body
}

export { findTodos }
export type { Todo }
````

### 2. The reducer

- With a union on `status`, a state never has both the todos and an error

```ts
// src/features/todos/utils/reducer.ts
import type { Todo } from "./api.js"

type TodosState =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "loaded"; todos: Todo[] }

type TodosAction =
  | { type: "load" }
  | { type: "receive"; todos: Todo[] }
  | { type: "fail"; message: string }

const INITIAL_STATE: TodosState = { status: "loading" }

/**
 * Compute the next state of the todos from the current one and an action.
 */
const todosReducer = (state: TodosState, action: TodosAction): TodosState => {
  switch (action.type) {
    case "load": {
      return state.status === "loading" ? state : { status: "loading" }
    }

    case "receive": {
      return { status: "loaded", todos: action.todos }
    }

    case "fail": {
      return { status: "failed", message: action.message }
    }
  }
}

export { INITIAL_STATE, todosReducer }
export type { TodosAction, TodosState }
```

### 3. The context

```ts
// src/features/todos/context.ts
import { createContext } from "react"

import type { TodosState } from "./utils/reducer.js"

type TodosActions = {
  reload: () => Promise<void>
}

type TodosContextValue = readonly [TodosState, TodosActions]

/**
 * The todos and their actions. `undefined` outside a `TodosProvider`, so
 * `useTodos` can detect a missing provider
 */
const TodosContext = createContext<TodosContextValue | undefined>(undefined)

export { TodosContext }
export type { TodosActions, TodosContextValue }
```

### 4. The provider

- Catch an error only to show it, as the `failed` state

````tsx
// src/features/todos/provider.tsx
import { useCallback, useEffect, useMemo, useReducer } from "react"
import type { FC, ReactNode } from "react"

import { TodosContext } from "./context.js"
import type { TodosContextValue } from "./context.js"
import { findTodos } from "./utils/api.js"
import { INITIAL_STATE, todosReducer } from "./utils/reducer.js"

type TodosProviderProps = {
  children: ReactNode
  /** Origin of the backend, eg. "https://api.acme.com" */
  backendUrl: string
}

/**
 * Load the todos, then share them and their actions with every component
 * inside.
 *
 * @example
 * ```tsx
 * <TodosProvider backendUrl="https://api.acme.com">
 *   <TodosCount />
 *   <TodosPage />
 * </TodosProvider>
 * ```
 */
const TodosProvider: FC<TodosProviderProps> = ({ children, backendUrl }) => {
  const [state, dispatch] = useReducer(todosReducer, INITIAL_STATE)

  const reload = useCallback(async () => {
    dispatch({ type: "load" })

    try {
      dispatch({ type: "receive", todos: await findTodos({ backendUrl }) })
    } catch (error) {
      dispatch({
        type: "fail",
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }, [backendUrl])

  // Sync with the backend: load on mount, and again for another backend
  useEffect(() => {
    void reload()
  }, [reload])

  const value = useMemo<TodosContextValue>(
    () => [state, { reload }],
    [state, reload]
  )

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export { TodosProvider }
export type { TodosProviderProps }
````

### 5. The hook

````ts
// src/features/todos/hook.ts
import { useContext } from "react"

import { TodosContext } from "./context.js"
import type { TodosContextValue } from "./context.js"

/**
 * Read the todos and their actions from the nearest `TodosProvider`, in the
 * shape of `useState`.
 *
 * Every `useTodos` call inside one `TodosProvider` returns the same todos.
 *
 * @throws {Error} Outside a `TodosProvider`
 *
 * @example
 * ```tsx
 * const TodosTitle = () => {
 *   const [state] = useTodos()
 *
 *   return <h1>{state.status === "loaded" ? state.todos.length : 0} todos</h1>
 * }
 * ```
 */
const useTodos = (): TodosContextValue => {
  const context = useContext(TodosContext)

  if (context === undefined) {
    throw new Error("useTodos needs a TodosProvider above it")
  }

  return context
}

export { useTodos }
````

### 6. The readers

```tsx
// src/features/todos/ui/todos-page.tsx
import { Button, Callout } from "@asd14/gruvbox-react/ui"
import type { FC } from "react"

import css from "./todos-page.module.css"
import { useTodos } from "../hook.js"
import type { Todo } from "../utils/api.js"

type TodosListProps = {
  todos: Todo[]
}

const TodosList: FC<TodosListProps> = ({ todos }) => (
  <ul className={css["list"]}>
    {todos.map(todo => (
      <li key={todo.id}>
        {todo.isDone ? "[x]" : "[ ]"} {todo.title}
      </li>
    ))}
  </ul>
)

/**
 * The todos, or why they did not load.
 */
const TodosPage: FC = () => {
  const [state, { reload }] = useTodos()

  // Guard the status once. The list below gets loaded todos only
  if (state.status === "loading") {
    return <p>Loading the todos…</p>
  }

  if (state.status === "failed") {
    return (
      <Callout variant="caution" title="The todos did not load">
        <p>{state.message}</p>
        <Button
          onClick={() => {
            void reload()
          }}>
          Retry
        </Button>
      </Callout>
    )
  }

  return <TodosList todos={state.todos} />
}

export { TodosPage }
```

```css
/* src/features/todos/ui/todos-page.module.css */
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--gvb-font-mono);
}
```

```tsx
// src/features/todos/ui/todos-count.tsx
import type { FC } from "react"

import { useTodos } from "../hook.js"

/**
 * The number of open todos, eg. in the app header.
 */
const TodosCount: FC = () => {
  const [state] = useTodos()

  if (state.status !== "loaded") {
    return undefined
  }

  return <span>{state.todos.filter(todo => !todo.isDone).length} open</span>
}

export { TodosCount }
```

### 7. The subtree

- Put the provider around the smallest subtree that contains its readers. At the
  app root, it loads the todos on every page, even a page without a reader

```tsx
// src/app.tsx
import { ColorSchemeRoot } from "@asd14/gruvbox-react/ui"
import type { FC } from "react"

import { TodosProvider } from "./features/todos/provider.js"
import { TodosCount } from "./features/todos/ui/todos-count.js"
import { TodosPage } from "./features/todos/ui/todos-page.js"

const BACKEND_URL = "https://api.acme.com"

const App: FC = () => (
  <ColorSchemeRoot>
    {/* The smallest subtree with both readers: one request, one state */}
    <TodosProvider backendUrl={BACKEND_URL}>
      <header>
        <h1>Todos</h1>
        <TodosCount />
      </header>
      <main>
        <TodosPage />
      </main>
    </TodosProvider>
  </ColorSchemeRoot>
)

export { App }
```

### 8. Tests

- Cover the adapter in a contract test, against the real backend

```ts
// src/features/todos/utils/reducer.test.ts
import { deepStrictEqual, strictEqual } from "node:assert"
import { describe, test } from "node:test"

import { INITIAL_STATE, todosReducer } from "./reducer.js"
import type { TodosState } from "./reducer.js"

const TODOS = [{ id: "1", title: "Buy milk", isDone: false }]

void describe("features/todos/utils/reducer :: todosReducer :: valid", () => {
  void test("given [received todos] should [store them]", () => {
    deepStrictEqual(
      todosReducer(INITIAL_STATE, { type: "receive", todos: TODOS }),
      { status: "loaded", todos: TODOS }
    )
  })

  void test("given [a failure] should [store its message]", () => {
    deepStrictEqual(
      todosReducer(INITIAL_STATE, {
        type: "fail",
        message: "GET /todos answered 500",
      }),
      { status: "failed", message: "GET /todos answered 500" }
    )
  })

  void test("given [a load after a failure] should [load again]", () => {
    const failedState: TodosState = {
      status: "failed",
      message: "GET /todos answered 500",
    }

    deepStrictEqual(todosReducer(failedState, { type: "load" }), {
      status: "loading",
    })
  })
})

void describe("features/todos/utils/reducer :: todosReducer :: edge", () => {
  void test("given [a load while loading] should [return the same state]", () => {
    strictEqual(todosReducer(INITIAL_STATE, { type: "load" }), INITIAL_STATE)
  })
})
```
