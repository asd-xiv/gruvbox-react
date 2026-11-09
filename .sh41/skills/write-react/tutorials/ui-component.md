# UI component

A component to render one piece of the UI from its props. It does not own app
state. It is not a page.

## Files

```text
src/ui/input/
├── input.tsx
├── input.module.css
└── input.test.tsx
```

## Literate style example

Each section adds one part of `Input`, a text input with its label, a hint and
an error.

### 1. The call

- Name a prop by what the caller knows
  - Bad: `isInvalid` and `errorMessage`
  - Good: `error`

```tsx
// in an app
<Input label="Email" type="email" hint="We send the invoice here" />
<Input label="Email" type="email" error="An email has an @" />
```

### 2. Props

- Omit a native prop only when the component changes the prop's meaning
- Add only the props the call needs
- Order the props, in the type and in the destructuring: native, data (strings,
  numbers, arrays, objects), booleans, `on*` props
- Take a data prop, eg. `options`, when the parts only show text. Take parts,
  eg. `SidebarMenuItem`, when the caller fills each part with its own markup
  - Parts that share state read it from a context that the root part provides.
    Keep that context inside the file

```tsx
// src/ui/input/input.tsx
/* eslint-disable react/forbid-dom-props --
   Ids link the label, the hint and the error to the input */

import { useId } from "react"
import type { ComponentProps, FC } from "react"

import css from "./input.module.css"
import { cn } from "../../utils/cn.js"

type InputProps = ComponentProps<"input"> & {
  /** Visible name of the input. Screen readers read it too */
  label: string
  /** Tells what to type, under the input */
  hint?: string
  /** Tells what is wrong with the value, and marks the input invalid */
  error?: string
}
```

### 3. The component

- Take a ref only in a component that renders one interactive element
  - Bad: `forwardRef`, the React 18 API
  - Good: `ref` from the props
- With no visible text, name the control with `aria-label`

````tsx
/**
 * Text input with its label, and an optional hint and error under it.
 *
 * @example
 * ```tsx
 * <Input label="Email" type="email" hint="We send the invoice here" />
 * <Input label="Email" type="email" error="An email has an @" />
 * ```
 */
const Input: FC<InputProps> = ({
  ref,
  id,
  className,
  label,
  hint,
  error,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const describedBy = [hint && hintId, error && errorId]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={cn(css["base"], className)}>
      <label className={css["label"]} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...props}
        className={css["input"]}
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      />
      {hint && (
        <span className={css["hint"]} id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className={css["error"]} id={errorId}>
          {error}
        </span>
      )}
    </div>
  )
}
````

### 4. The name and the exports

- Only gruvbox-react sets `displayName`, to tell its components apart in React
  DevTools

```tsx
Input.displayName = "GruvboxInput"

export { Input }
export type { InputProps }
```

```ts
// src/ui/index.ts
export * from "./input/input.js"
```

### 5. Styles

- The global styles give every focusable element its focus ring. Change only its
  offset

```css
/* src/ui/input/input.module.css */
.base {
  composes: grid gap-1 from global;
  font-family: var(--gvb-font-mono);
}

.label {
  composes: text-sm font-bold from global;
}

.input {
  padding: var(--gvb-unit);
  color: var(--gvb-fg-primary);
  background-color: var(--gvb-bg-secondary);
  border: var(--gvb-border-width-thin) solid var(--gvb-fg-tertiary);
  border-radius: var(--gvb-radius-none);
}

.input:hover {
  border-color: var(--gvb-fg-secondary);
}

.input:disabled {
  color: var(--gvb-fg-muted);
  cursor: not-allowed;
}

.input[aria-invalid="true"] {
  border-color: var(--gvb-color-error);
}

.hint {
  composes: text-xs from global;
  color: var(--gvb-fg-tertiary);
}

.error {
  composes: text-xs from global;
  color: var(--gvb-color-error);
}
```

### 6. Tests

```tsx
// src/ui/input/input.test.tsx
import { strictEqual } from "node:assert"
import { afterEach, describe, test } from "node:test"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"

import { Input } from "./input.js"

void describe("ui/input :: Input :: valid", () => {
  // node:test does not define a global afterEach, so Testing Library cannot
  // clean up after each test on its own
  afterEach(cleanup)

  void test("given [a label and a hint] should [name and describe the input]", () => {
    render(<Input label="Email" hint="We send the invoice here" />)

    const input = screen.getByRole("textbox", {
      name: "Email",
      description: "We send the invoice here",
    })

    strictEqual(input.getAttribute("aria-invalid"), null)
  })

  void test("given [an error] should [mark the input invalid and describe it]", () => {
    render(<Input label="Email" error="An email has an @" />)

    const input = screen.getByRole("textbox", {
      name: "Email",
      description: "An email has an @",
    })

    strictEqual(input.getAttribute("aria-invalid"), "true")
  })

  void test("given [a typed value] should [call onChange with it]", () => {
    let value = ""

    render(
      <Input
        label="Email"
        onChange={event => {
          value = event.target.value
        }}
      />
    )

    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "ada@example.com" },
    })

    strictEqual(value, "ada@example.com")
  })

  void test("given [a ref] should [point it at the input]", () => {
    const ref = createRef<HTMLInputElement>()

    render(<Input label="Email" ref={ref} />)

    strictEqual(ref.current, screen.getByRole("textbox", { name: "Email" }))
  })
})

void describe("ui/input :: Input :: edge", () => {
  afterEach(cleanup)

  void test("given [a hint and an error] should [describe the input with both, hint first]", () => {
    render(
      <Input
        label="Email"
        hint="We send the invoice here"
        error="An email has an @"
      />
    )

    const input = screen.getByRole("textbox", { name: "Email" })

    strictEqual(
      input.getAttribute("aria-describedby"),
      `${input.id}-hint ${input.id}-error`
    )
  })

  void test("given [an id] should [keep it and link the label to it]", () => {
    render(<Input id="billing-email" label="Email" />)

    strictEqual(
      screen.getByRole("textbox", { name: "Email" }).id,
      "billing-email"
    )
  })
})
```
