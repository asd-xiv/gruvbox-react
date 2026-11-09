---
name: write-react
description: |
  Writes and reviews React components, hooks and providers in the style of
  gruvbox-react: only CSS modules and its tokens. Use when the work is a
  `*.tsx` component, a `use*` hook, a context provider or a `*.module.css`
  file, in `@asd14/gruvbox-react` or in an app that imports it.
metadata:
  version: "0.1.0"
---

<!-- sh41:
Sources used for various decisions in this skill:

- Gruvbox palette: https://github.com/morhetz/gruvbox
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/patterns/
- React, "You Might Not Need an Effect":
  https://react.dev/learn/you-might-not-need-an-effect
- stageshow, by Benji Taylor:
  https://github.com/benjitaylor/skills/tree/main/stageshow. Its method, and
  its spacing, type and color rules. Its 6-12px radii, blurred shadows and
  "monospace only for code" do not fit
- WebTUI and The Monospace Web, for the `1ch` cell
-->

A React unit to do one job, in the look of a terminal: few colors, one spacing
unit, corners of 2px at most. A unit is a component, a hook or a provider. The
skill is not a general React guide, nor a Tailwind or shadcn/ui setup.

## Input

1. The unit to write or review, and the call its caller writes, eg.
   `<Input label="Email" />` or `useSelection()`
   - Without the call, sketch it first and show it to the User
2. What gruvbox-react exports, to reuse before you write a unit
   - In gruvbox-react: `src/ui/index.ts`, `src/hooks/index.ts`, `src/utils/`,
     and the tokens in `src/design-system/tokens.css` and
     `src/design-system/themes.css`
   - In an app: `dist/ui/index.d.ts`, `dist/hooks/index.d.ts` and the tokens in
     `dist/styles/index.css`, under `node_modules/@asd14/gruvbox-react/`

## Files

In gruvbox-react:

```text
src/
├── design-system/       # tokens, color schemes, utilities, reset: global CSS
├── icons/nerd.ts        # the Nerd Font glyphs, eg. `icons.oct.info`
├── ui/<name>/           # one component, or a component and its parts
│   ├── <name>.tsx
│   ├── <name>.module.css
│   └── <name>.test.tsx
├── hooks/<name>/
│   ├── hook.ts
│   ├── hook.test.ts
│   └── utils/           # the primitives only this hook uses
└── utils/               # the primitives two units share, eg. `cn`
```

In an app:

```text
src/features/<feature>/  # one folder per feature
├── context.ts
├── provider.tsx
├── hook.ts
├── ui/                  # its components
└── utils/               # its adapter and its reducer
```

## Conventions

<!-- sh41:
Left out, because @asd14/eslint-config/react enforces them: arrow function
components, an is/has/can/should prefix on boolean props and variables, `on*`
props and `handle*` handlers, the exports at the end of a file, `.js`
extensions in imports, a `type` on each button, the rules of hooks and their
dependency arrays
-->

### Principles

<!-- sh41:
React forms of the 02.one-way-flow rules 1 (a primitive does not use the
project's nouns), 4 (IO sits at the ends) and 5 (a child gets only what it
uses), and of the 03.coding rules 10 (colocate by feature) and 12 (write the
primitive first). Kept so the skill works alone
-->

- Use the gruvbox-react component, never a lookalike. A hand-made button has the
  wrong padding, hover and focus
- State flows down as props. Events flow up through `on*` props. A child never
  reads its parent's state
- Pass a child only what it uses: `<Avatar name pictureUrl />`, never
  `<Avatar user />`. A gruvbox-react unit does not use an app's nouns
- Write the primitive first, then bind it. `TriStateSwitch` takes `value` and
  `onChange`. `ColorSchemeSwitch` binds it to `useColorScheme`
- Derive a value during render. Never copy a prop or a state into another state
  with an effect
- Put IO at the ends: an adapter reads and writes, a reducer computes, a
  component renders
- Start a unit in its feature folder. Elevate it to gruvbox-react when a second
  app needs it, and remove the app's nouns from it
- In gruvbox-react, prefix every global name a unit creates with `gvb`: custom
  properties, data attributes, storage keys and its own events

### Where state lives

| The state                                                           | Lives in                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| One component uses it                                               | `useState`, in that component                                             |
| Each call owns a copy                                               | a state hook                                                              |
| A subtree shares it                                                 | a context provider, around the smallest subtree that contains its readers |
| A source outside React owns it, eg. storage, the URL, a media query | an external-store hook, with no context: every call reads the one source  |

### Terminal design

- Take a token another component already takes, before a new one
- Color
  - Surfaces and text take `--gvb-bg-*` and `--gvb-fg-*`
  - Status takes `--gvb-color-success`, `-warning`, `-error` and `-info`, and
    only status does
  - A component takes one `--gvb-bright-*` accent at most
  - Never write a hex color, `rgb()`, `opacity`, a gradient or a blur
- Space
  - Gaps, paddings and margins come from `--gvb-unit` and its multiples
    - An inline component, eg. a badge, pads in `1ch` cells: `padding: 0 1ch`
  - Set the space between items with a fixed `gap`, never with
    `justify-content: space-between`
  - Edges line up exactly, or sit at least `--gvb-unit` apart
  - A box, eg. a card or a window, takes one padding value on every side
- Shape
  - Corners take `--gvb-radius-none` or `--gvb-radius-sm`
  - Draw a border only for a boundary, eg. a field or a box, or for a state, eg.
    an error. Never draw one in a near shade of the fill
- Type
  - The UI is monospace, `--gvb-font-mono`. Prose stays serif, `--gvb-font-body`
  - Hierarchy comes from one weight step, bold. Change the size last
  - Write in sentence case. Use uppercase only for a short label, with
    `--gvb-letter-spacing-wide`
  - A spinner or a tick takes one `1ch` cell. Its glyphs change inside that
    cell, so the text next to it never moves
  - Center a label in its box with `text-box: trim-both cap alphabetic`. A
    browser without `text-box` skips the declaration, so do not write a fallback
- Shadow
  - Only these components cast the Turbo Pascal shadow: a dialog, a menu, a
    popover, a toast, a filled button, a callout and a card. Every other
    component stays flat
  - Cast it only through the `shadow` utility, `composes: shadow from global`.
    Never write a `box-shadow`
  - A component with the shadow has a 1px border. A child scrolls, never the
    component: an `overflow` on the component would clip the shadow
- Motion
  - Animate only color, background and transform, with `--gvb-transition-fast`
  - Do not animate under `prefers-reduced-motion: reduce`. In JS, read the query
    with an external-store hook over `matchMedia`
- Only an interactive component takes a hover: one step of its own color, eg.
  `--gvb-bright-blue` to `--gvb-neutral-blue`
- An icon is a Nerd Font glyph from `src/icons/nerd.ts` in gruvbox-react, or
  from `@asd14/gruvbox-react/icons-nerd` in an app. Give it
  `aria-hidden="true"`, and put a text label next to it
  - A mark that repeats a state, eg. `❯` on the highlighted item, goes in CSS
    `content`

### CSS modules

- One `<name>.module.css` next to `<name>.tsx`, imported as `css`. Read a class
  as `css["base"]`
- Name the classes `base`, `variant-<name>` and `size-<name>`, and each element
  by its role, eg. `header`
- A variant sets custom properties, and the `base` rule reads them, eg.
  `--gvb-callout-accent` in Callout
- Compose the global utilities for layout, eg.
  `composes: flex gap-1 from global`. Write the rest as declarations that read
  tokens
- Style a state from the DOM: `:disabled`, `[aria-invalid="true"]`,
  `[aria-current="page"]`, `[data-highlighted]`
- The module owns the look. The caller's `className` adds layout, joined last
  with `cn`
- The global styles give a bare `p`, `ul` and heading a margin. A component that
  renders one sets the margin in its module
- Never use the `style` prop, CSS-in-JS or Tailwind
- React renders a portal to `<body>` outside the color scheme root, so its
  content does not get the tokens. Use the top layer, `<dialog>` or `popover`,
  or portal into the nearest color scheme root, `[data-gvb-color-scheme]`

### Hooks

- Return in the shape of `useState`: `[value, setValue]` for one value,
  `readonly [state, actions]` for more. A hook that only reads returns the bare
  value, eg. `useOnlineStatus(): boolean`
- Keep each action stable: build the actions once from `dispatch`, or wrap each
  in `useCallback`
- Do not run code on import. A hook starts its work when a component calls it

### Dependencies

- Use a native element first: `<dialog>`, `popover`, `<details>`, `<select>`,
  `<input type="date">`, `<input type="checkbox" role="switch">`
  - Use the native element when it covers the WAI-ARIA pattern's required keys.
    An optional key, eg. the arrows of an accordion, does not justify a
    dependency
- Add a dependency only for roving focus, typeahead, a combobox, or a hard
  algorithm
- Use one behavior library, Base UI, as a peer dependency of gruvbox-react.
  gruvbox-react wraps it, so the app never imports it
- For a hard algorithm: `@tanstack/react-table` for table models,
  `@tanstack/react-virtual` for windowing, `@tanstack/react-query` for a cache
  of server state that pages share
  - For a single request, skip `@tanstack/react-query`: write the request by
    hand, in a provider
- Reject a dependency that injects styles at runtime, does not take a
  `className` or set `data-*` state attributes, or has not released in 12 months

### Tests

- Write the tests with `node:test` and Testing Library, in a `.test.ts` or
  `.test.tsx` file next to the file they cover
- Name each `describe` `<path> :: <function> :: <kind>`, with the kinds in this
  order: `valid`, `edge`, `invalid`. Leave out a kind with no tests. Title each
  test `given [X] should [Y]`
- Cover reducers and primitives in full. Cover a component by what the user sees
  and does, and query it by role and name

## Tutorials

Open the one for the kind of unit you write. Copy its shape, then adapt it.

| Tutorial                                                   | The unit                                      |
| ---------------------------------------------------------- | --------------------------------------------- |
| [ui-component.md](tutorials/ui-component.md)               | a component that renders markup               |
| [state-hook.md](tutorials/state-hook.md)                   | a hook that owns React state                  |
| [external-store-hook.md](tutorials/external-store-hook.md) | a hook that reads a source React does not own |
| [context-provider.md](tutorials/context-provider.md)       | state and actions that a subtree shares       |

## Recipes

Open one as well, when the problem matches.

| Recipe                                                           | Open it when                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [port-from-shadcn.md](recipes/port-from-shadcn.md)               | gruvbox-react lacks a component that shadcn/ui has         |
| [wrap-a-behavior-library.md](recipes/wrap-a-behavior-library.md) | the component needs a behavior library, eg. for a combobox |
| [break-an-effect-cycle.md](recipes/break-an-effect-cycle.md)     | two effects set each other's state, or a request repeats   |

## Verify

- [ ] Verify the package with lint, typecheck and the unit tests, eg.
      `npx nx run-many -t lint typecheck unit-test -p <project>`
- [ ] The modules do not contain a raw color, `opacity` or `box-shadow`:
      `grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|opacity|box-shadow' <files>` prints
      nothing
- [ ] Every control has a name, and works with the keyboard alone
- [ ] Render the component on a page, and look at it in both color schemes
- [ ] The unit avoids each fault that comes back:
  - a lookalike of a gruvbox-react component
  - a state that an effect copies from a prop or from another state
  - a portal to `<body>`, outside the color scheme root
  - a button with an icon and no name
  - a bare `p`, `ul` or heading inside a component, with the margin of the
    global styles
