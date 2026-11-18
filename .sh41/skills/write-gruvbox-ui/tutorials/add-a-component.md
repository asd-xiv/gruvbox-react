# Add a component

A component of gruvbox-react: its CSS module, its name and its styles. Add one
when two apps need it. It is not a component of an app.

## Files

```text
src/
├── design-system/       # tokens, color schemes, utilities, reset: global CSS
├── icons/nerd.ts        # the Nerd Font glyphs, eg. `icons.oct.info`
├── ui/
│   ├── index.ts         # exports each component
│   └── input/
│       ├── input.tsx
│       ├── input.module.css
│       └── input.test.tsx
└── utils/               # the primitives two components share, eg. `cn`
```

## Literate style example

Each section adds one part of `Input`, a text input with its label, a hint and
an error.

### 1. The module

- Create `<name>.module.css` next to `<name>.tsx`. Import it as `css`, and read
  a class as `css["base"]`
- Name the classes `base`, `variant-<name>` and `size-<name>`, and each element
  by its role, eg. `header`
- `cn` joins the caller's `className` last, after the module's class
- Never use CSS-in-JS or Tailwind

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

/**
 * Text input with its label, and an optional hint and error under it.
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
```

### 2. The name

- Prefix every global name a component creates with `gvb`: custom properties,
  data attributes, storage keys and its own events
- Set the `displayName` of each component to `Gruvbox<Name>`, so React DevTools
  lists it apart from the app's components

```tsx
Input.displayName = "GruvboxInput"

export { Input }
export type { InputProps }
```

```ts
// src/ui/index.ts
export * from "./input/input.js"
```

### 3. Styles

These rules add to the design principles of `SKILL.md`:

- Use a token another component already uses, before you add a new one
- Space
  - An inline component, eg. a badge, pads in `1ch` cells: `padding: 0 1ch`
  - Edges line up exactly, or sit at least `--gvb-unit` apart
- Type
  - The UI uses `--gvb-font-mono`, prose uses `--gvb-font-body`
  - An uppercase label uses `--gvb-letter-spacing-wide`
  - A spinner or a tick fills one `1ch` cell. Its glyphs change inside that
    cell, so the text next to it never moves
  - Center a label in its box with `text-box: trim-both cap alphabetic`. A
    browser without `text-box` skips the declaration, so do not write a fallback
- Shadow
  - A component with the shadow has a `--gvb-border-width-thin` border and
    `--gvb-radius-none` corners. A child scrolls, never the component: an
    `overflow` on the component would clip the shadow
- Animate with `--gvb-transition-fast`
- Only an interactive component has a hover style: one step of its own color,
  eg. `--gvb-bright-blue` to `--gvb-neutral-blue`
- An icon is a Nerd Font glyph from `src/icons/nerd.ts`
  - A mark that repeats a state, eg. `❯` on the highlighted item, goes in CSS
    `content`
- A variant sets custom properties, and the `base` rule uses them, eg.
  `--gvb-callout-accent` in Callout
- The global styles give a bare `p`, `ul` and heading a margin. A component that
  renders one sets the margin in its module
- The global styles give every focusable element its focus ring. Change only its
  offset
- Add a font as WOFF2, with its license, in `src/design-system/fonts/`
  - You may add its source `.ttf` too
  - Point `@font-face` at the WOFF2 file only

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

## Verify

- [ ] Render the component on a page, and look at it in both color schemes
- [ ] The component has none of these common faults:
  - a portal to `<body>`, outside the color scheme root
  - a bare `p`, `ul` or heading inside a component, with the margin of the
    global styles
