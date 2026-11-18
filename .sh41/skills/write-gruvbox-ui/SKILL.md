---
name: write-gruvbox-ui
description: |
  Writes and reviews UI with gruvbox-react: its components, its tokens and CSS
  modules. Use when the work is a `*.module.css` file, or a component in
  `@asd14/gruvbox-react` or in an app that imports it.
metadata:
  version: "0.1.0"
---

<!-- sh41:
Sources used for various decisions in this skill:

- Gruvbox palette: https://github.com/morhetz/gruvbox
- stageshow, by Benji Taylor:
  https://github.com/benjitaylor/skills/tree/main/stageshow. Its method, and
  its spacing, type and color rules. Its 6-12px radii, blurred shadows and
  "monospace only for code" do not fit
- WebTUI and The Monospace Web, for the `1ch` cell
-->

A React UI kit in the look of a terminal: few colors, one spacing unit, corners
of 2px at most. It is not Tailwind or shadcn/ui.

## Quick start

```sh
npm install @asd14/gruvbox-react @base-ui/react
```

```css
/* src/index.css */
@import "@asd14/gruvbox-react";
```

```tsx
// src/app.tsx
import { Button, ColorSchemeRoot } from "@asd14/gruvbox-react/ui"

import css from "./app.module.css"

const App = () => (
  <ColorSchemeRoot className={css["page"]}>
    <Button variant="outline">Save</Button>
  </ColorSchemeRoot>
)
```

## Use it

- Render one `ColorSchemeRoot` around the app. The tokens and the styles live
  inside it
- Style the app's own components with a CSS module next to each one
  - Compose the global utilities for layout: `composes: flex gap-1 from global`.
    They share Tailwind's names, not its values: `p-1` is 8px
  - Write the rest as declarations that use `--gvb-*` tokens
  - Style a state from the DOM: `:disabled`, `[aria-invalid="true"]`
- Pass a component a `className` for layout only. Its module owns the look
- Render a link as a button with `render`: `<Button render={<a href="/" />}>`
- Never portal to `<body>`: it renders outside the root, with no tokens. Use
  `<dialog>`, `popover`, or a portal into `[data-gvb-color-scheme]`
- Take an icon from `@asd14/gruvbox-react/icons-nerd`. Give it
  `aria-hidden="true"` and a text label next to it

## Design principles

- **Color**: surfaces use `--gvb-bg-*`, text uses `--gvb-fg-*`. Only status uses
  `--gvb-color-*`. One `--gvb-bright-*` accent per component. No hex, gradient
  or blur, and an `opacity` of 0 or 1 only
- **Space**: `--gvb-unit` and its multiples, or `1ch` cells inline. A fixed
  `gap`, never `space-between`. One padding on every side of a box
- **Shape**: corners of `--gvb-radius-none` or `--gvb-radius-sm`. A border marks
  a boundary or a state, never a near shade of the fill
- **Type**: monospace UI, serif prose. Hierarchy is bold, then size. Sentence
  case, uppercase only for a short label
- **Shadow**: one Turbo Pascal shadow, cast with `composes: shadow from global`,
  only by a dialog, a menu, a popover, a toast, a filled button, a callout or a
  card
- **Motion**: color, background and transform only, inside
  `@media (prefers-reduced-motion: no-preference)`

## Components

Read the props, parameters, defaults and examples of a component or a hook in
its types: `node_modules/@asd14/gruvbox-react/dist/<ui|hooks>/<folder>/*.d.ts`,
or `src/<ui|hooks>/<folder>/` in gruvbox-react.

From `@asd14/gruvbox-react/ui`:

| Component                          | Use it for                                   | Folder              |
| :--------------------------------- | :------------------------------------------- | :------------------ |
| `Button`                           | an action, or a link in the look of a button | `button/`           |
| `Callout`                          | a note, a tip or a warning to the reader     | `callout/`          |
| `Card`                             | a group with a title                         | `card/`             |
| `Heading`                          | a page or section title                      | `heading/`          |
| `CodeBlock`                        | highlighted code                             | `code-block/`       |
| `Sidebar` and its `Sidebar*` parts | side navigation                              | `sidebar/`          |
| `TriStateSwitch`                   | a choice of three, eg. a text size           | `tri-state-switch/` |
| `ColorSchemeRoot`                  | the root of the app, once                    | `color-scheme/`     |
| `ColorSchemeSwitch`                | the dark, system and light switch            | `color-scheme/`     |

From `@asd14/gruvbox-react/hooks`:

| Hook                                             | Use it for                          | Folder          |
| :----------------------------------------------- | :---------------------------------- | :-------------- |
| `useColorScheme`                                 | the color scheme, read or set in JS | `color-scheme/` |
| `useLocalState`                                  | a state kept in `localStorage`      | `local-state/`  |
| `useDomEventsDispatcher`, `useDomEventsListener` | app events over the DOM             | `dom-events/`   |

## Tutorials

| Tutorial                                           | Open it to write                                                      |
| :------------------------------------------------- | :-------------------------------------------------------------------- |
| [add-a-component.md](tutorials/add-a-component.md) | a component of gruvbox-react: its CSS module, its name and its styles |

## Recipes

Open a recipe with the tutorial, not in its place.

| Recipe                                                           | Open it when                                               |
| :--------------------------------------------------------------- | :--------------------------------------------------------- |
| [port-from-shadcn.md](recipes/port-from-shadcn.md)               | gruvbox-react lacks a component that shadcn/ui has         |
| [wrap-a-behavior-library.md](recipes/wrap-a-behavior-library.md) | the component needs a behavior library, eg. for a combobox |
