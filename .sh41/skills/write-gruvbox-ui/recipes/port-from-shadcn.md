# Port from shadcn

A component that gruvbox-react lacks, ported from shadcn/ui and trimmed to the
terminal look. It is not a copy: the port keeps the behavior and rewrites the
look.

<!-- sh41:
Sources:

- shadcn/ui registry: https://ui.shadcn.com/r/styles/new-york-v4/<name>.json,
  and `apps/v4/registry/new-york-v4/ui/<name>.tsx` in shadcn-ui/ui
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/patterns/
- HTML Standard, Rendering, §15.3.3 Flow content: `dialog` sets
  `margin: auto`, and `dialog:modal` sets `position: fixed` and
  `overflow: auto`
- `::backdrop` inherits from its dialog since Chrome 122, Firefox 120 and
  Safari 17.4. CSS Position 4 does not state it
-->

## Steps

1. Find the component
   - gruvbox-react's exports first, then shadcn/ui, then the WAI-ARIA pattern
     for its keys
2. Read its anatomy: the parts, the behavior library behind them, the ARIA, the
   keys and the `data-*` state attributes
3. Pick a native element when it handles every keyboard key the WAI-ARIA pattern
   requires, or a behavior library otherwise
   - Use a native element in place of a Radix component where one exists, eg.
     `<dialog>` for Dialog, `<details name>` for Accordion
4. Keep the ARIA, the required keys, the state attributes, and a title on every
   dialog
5. Remove the animations, the extra variants and sizes, the `dark:` classes, the
   opacity steps, `cva` and `tailwind-merge`
6. Map each Tailwind class to a token. The gruvbox-react utilities share
   Tailwind's names, not its values:

   | Tailwind                                | gruvbox-react                                   |
   | --------------------------------------- | ----------------------------------------------- |
   | `p-2`, `gap-2`: 8px                     | `--gvb-unit`, the `p-1` and `gap-1` utilities   |
   | `p-4`, `gap-4`: 16px                    | `--gvb-unit-2`, the `p-2` and `gap-2` utilities |
   | `rounded-md`: 6px                       | `--gvb-radius-sm`                               |
   | `shadow-*`                              | the `shadow` utility                            |
   | `bg-background`                         | `--gvb-bg-primary`                              |
   | `bg-popover`, `bg-card`                 | `--gvb-bg-secondary`                            |
   | `bg-accent`                             | `--gvb-bg-tertiary`                             |
   | `bg-primary`, `text-primary-foreground` | `--gvb-bright-blue`, `--gvb-dark0`              |
   | `text-muted-foreground`, `border-input` | `--gvb-fg-tertiary`                             |
   | `text-destructive`                      | `--gvb-color-error`                             |
   | `ring-ring`                             | the focus ring of the global styles             |

7. Write `<name>.tsx` and `<name>.module.css`

## Example: Dialog

The shadcn/ui Dialog renders Radix Dialog through a Portal, with an Overlay, a
Content with animations and a close icon, a Header, a Title, a Description and a
Footer. The port keeps the title and the content, on the native `<dialog>`.

````tsx
// src/ui/dialog/dialog.tsx
/* eslint-disable react/forbid-dom-props --
   The title id names the dialog through aria-labelledby */

import { useEffect, useId, useRef } from "react"
import type { FC, ReactNode } from "react"

import css from "./dialog.module.css"
import { cn } from "../../utils/cn.js"

type DialogProps = {
  children: ReactNode
  className?: string
  /** Names the dialog, on its top border */
  title: string
  isOpen: boolean
  /**
   * Runs on each close: Esc, the submit of a `<form method="dialog">` inside,
   * or `isOpen` set to `false`
   */
  onClose: () => void
}

/**
 * Modal dialog on the native `<dialog>`. The browser traps the focus, closes
 * the dialog on Esc and shows it in the top layer.
 *
 * @example
 * ```tsx
 * <Dialog title="Delete class" isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Delete Employment and its 2 properties?</p>
 *   <form method="dialog">
 *     <Button type="submit" variant="secondary">Cancel</Button>
 *   </form>
 * </Dialog>
 * ```
 */
const Dialog: FC<DialogProps> = ({
  children,
  className,
  title,
  isOpen,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // Sync the native `<dialog>` with `isOpen`: only `showModal()` opens a modal
  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className={cn(css["base"], className)}
      aria-labelledby={titleId}
      onClose={onClose}>
      <h2 className={css["title"]} id={titleId}>
        {title}
      </h2>
      <div className={css["body"]}>{children}</div>
    </dialog>
  )
}

Dialog.displayName = "GruvboxDialog"

export { Dialog }
export type { DialogProps }
````

- A modal is the focused window, so the `shadow` utility draws its shadow solid
- `::backdrop` reads the tokens of its dialog

```css
/* src/ui/dialog/dialog.module.css */
.base {
  composes: shadow from global;
  /* The reset zeroes every margin. The browser centers a modal with
     `margin: auto` */
  margin: auto;
  /* The browser gives a modal `overflow: auto`, which clips the shadow */
  overflow: visible;
  width: min(100% - var(--gvb-unit-4), 32rem);
  padding: var(--gvb-unit-2);
  font-family: var(--gvb-font-mono);
  color: var(--gvb-fg-primary);
  background-color: var(--gvb-bg-secondary);
  border: var(--gvb-border-width-thin) solid var(--gvb-fg-tertiary);
}

.base::backdrop {
  background: var(--gvb-shadow-dither) 0 0 / 2px 2px;
  image-rendering: pixelated;
}

/* The title sits on the top border, as in a Turbo Pascal window */
.title {
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50% -50%;
  margin: 0;
  padding: 0 1ch;
  font-size: var(--gvb-font-size-xs);
  letter-spacing: var(--gvb-letter-spacing-wide);
  text-transform: uppercase;
  white-space: nowrap;
  background-color: var(--gvb-bg-secondary);
}

/* `.body` scrolls, never the dialog: its overflow would clip the shadow */
.body {
  max-height: 70dvh;
  overflow-y: auto;
}
```
