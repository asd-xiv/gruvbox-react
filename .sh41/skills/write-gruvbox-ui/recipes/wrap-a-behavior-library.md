# Wrap a behavior library

A component whose behavior a library owns, eg. the keys of a combobox. A CSS
module styles it. gruvbox-react wraps the library, so the app never imports it.

<!-- sh41:
Checked against @base-ui/react 1.9.0, in November 2026. Docs:
https://base-ui.com/react/components/combobox.md

- `Popup` throws outside a `Positioner`
- `Portal` renders to `<body>` for an `undefined` container, and waits for a
  `null` one
- The `List` child function needs `(item: string)`: `items` on `Root` is
  `any[]`
-->

## Steps

1. Take the component from Base UI, the one behavior library of gruvbox-react

## Example: Combobox

Base UI's Combobox owns the keys: the arrows move the highlight, Enter selects,
Esc closes.

````tsx
// src/ui/combobox/combobox.tsx
import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { useCallback, useId, useState } from "react"
import type { FC } from "react"

import css from "./combobox.module.css"
import { cn } from "../../utils/cn.js"

type ComboboxProps = {
  className?: string
  /** Visible name of the input. Screen readers read it too */
  label: string
  items: readonly string[]
  /** The selected item. `undefined` clears the selection */
  value: string | undefined
  onChange: (value: string | undefined) => void
}

/**
 * Text input that filters a list of items as the user types. Base UI owns the
 * keys, the focus and the ARIA. This file owns the look.
 *
 * @example
 * ```tsx
 * <Combobox
 *   label="Class"
 *   items={["Agent", "Organization", "Person"]}
 *   value={className}
 *   onChange={setClassName}
 * />
 * ```
 */
const Combobox: FC<ComboboxProps> = ({
  className,
  label,
  items,
  value,
  onChange,
}) => {
  const inputId = useId()
  // Base UI waits while the container is `null`, and portals to `<body>` when
  // it is `undefined`, outside the color scheme root
  const [container, setContainer] = useState<HTMLElement | null>(null)

  // Portal into the nearest color scheme root, so the popup inherits the tokens
  const findContainer = useCallback((node: HTMLDivElement | null) => {
    setContainer(node?.closest<HTMLElement>("[data-gvb-color-scheme]") ?? null)
  }, [])

  return (
    <BaseCombobox.Root
      items={items}
      value={value ?? null}
      onValueChange={nextValue => {
        onChange(nextValue ?? undefined)
      }}>
      <div className={cn(css["base"], className)} ref={findContainer}>
        <label className={css["label"]} htmlFor={inputId}>
          {label}
        </label>
        <BaseCombobox.Input className={css["input"]} id={inputId} />
      </div>
      <BaseCombobox.Portal container={container}>
        <BaseCombobox.Positioner sideOffset={8}>
          <BaseCombobox.Popup className={css["popup"]}>
            <BaseCombobox.Empty className={css["empty"]}>
              No match
            </BaseCombobox.Empty>
            <BaseCombobox.List className={css["list"]}>
              {(item: string) => (
                <BaseCombobox.Item
                  key={item}
                  className={css["item"]}
                  value={item}>
                  {item}
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}

Combobox.displayName = "GruvboxCombobox"

export { Combobox }
export type { ComboboxProps }
````

- `--anchor-width` and `--available-height` come from Base UI's `Positioner`

```css
/* src/ui/combobox/combobox.module.css */
/**
 * Base UI sets the state attributes, eg. `data-highlighted`. This module styles
 * them with the tokens
 */

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

.input[data-popup-open] {
  border-color: var(--gvb-fg-secondary);
}

/* A layer above the page. `.list` scrolls, never the popup: its overflow would
   clip the shadow */
.popup {
  composes: shadow from global;
  width: var(--anchor-width);
  font-family: var(--gvb-font-mono);
  background-color: var(--gvb-bg-secondary);
  border: var(--gvb-border-width-thin) solid var(--gvb-fg-tertiary);
}

.list {
  max-height: min(var(--available-height), 16rem);
  overflow-y: auto;
}

.item {
  padding: 0 var(--gvb-unit);
  line-height: var(--gvb-line-height-relaxed);
  white-space: pre;
  cursor: default;
}

.item::before {
  content: "  ";
}

.item[data-highlighted] {
  background-color: var(--gvb-bg-tertiary);
}

.item[data-highlighted]::before {
  content: "❯ ";
}

.item[data-selected] {
  font-weight: var(--gvb-font-weight-bold);
}

.empty {
  padding: 0 var(--gvb-unit);
  line-height: var(--gvb-line-height-relaxed);
  color: var(--gvb-fg-tertiary);
}

/* Base UI keeps `Empty` mounted, with no text while items match */
.empty:empty {
  display: none;
}
```
