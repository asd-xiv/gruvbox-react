# `@asd14/gruvbox-react` library decisions

This file holds the decisions whose "why" the code and the other docs do not
show. It is not a todo list, release notes or a session log.

<!-- vim-markdown-toc GFM -->

- [3. Forward a ref only from an interactive element, an app needs a ref to focus or anchor to it](#3-forward-a-ref-only-from-an-interactive-element-an-app-needs-a-ref-to-focus-or-anchor-to-it)
- [2. Hold the color scheme in `<ColorSchemeRoot>`, a page-wide color scheme reached other apps and painted late](#2-hold-the-color-scheme-in-colorschemeroot-a-page-wide-color-scheme-reached-other-apps-and-painted-late)
- [1. Add a CommonJS build, `postcss-loader` loads plugins with `require`](#1-add-a-commonjs-build-postcss-loader-loads-plugins-with-require)
  - [1.1 drop | Publish ESM and CSS only, no app loads the library through `postcss-loader` now](#11-drop--publish-esm-and-css-only-no-app-loads-the-library-through-postcss-loader-now)

<!-- vim-markdown-toc -->

## 3. Forward a ref only from an interactive element, an app needs a ref to focus or anchor to it

**Date**: 21st of October, 2026

**Problem**:

- An app needs a ref to an interactive element, eg. to focus a button or anchor
  a popover to it
- An app needs no ref to a layout part

**Solution**:

- A component that renders one interactive element forwards a ref, eg. `Button`
- Every other component takes no ref, eg. `SidebarHeader`, `Callout`

## 2. Hold the color scheme in `<ColorSchemeRoot>`, a page-wide color scheme reached other apps and painted late

**Date**: 21st of October, 2026

**Problem**:

- The library styled the whole page: the reset, `body`, `h1`-`h6`, the utility
  classes and the `:root` variables
  - They applied to every app on the page, eg. a microfrontend
- Generic names, eg. `data-theme` and `--bg-primary`, clashed with the names of
  other libraries
- The app had to keep `DarkModeProvider` mounted to write the color scheme to
  the page
- Its effect wrote the color scheme, as `data-theme`, after the browser painted
  - The browser painted the dark default before the user's light choice

**Solution**:

- `<ColorSchemeRoot>` sets the color scheme before the browser paints
- Scope every library style to `<ColorSchemeRoot>`
- Prefix every name the library puts on the page with `gvb`, eg.
  `--gvb-bg-primary`, `data-gvb-color-scheme`

## 1. Add a CommonJS build, `postcss-loader` loads plugins with `require`

**Date**: 2nd of January, 2025

**Problem**:

- `postcss-loader`, in webpack, loads a PostCSS plugin with `require`
  - `require` fails on an ESM-only package:

    ```text
    Error: Module build failed (from ../../../../node_modules/postcss-loader/dist/cjs.js):
    Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in node_modules/@asd14/tailwind-gruvbox/package.json
        at exportsNotFound (node:internal/modules/esm/resolve:304:10)
    ```

**Solution**:

- Split `build:src` into `build:src:esm` and `build:src:cjs`
  - Each runs `swc` for one module system, ESM or CommonJS

### 1.1 drop | Publish ESM and CSS only, no app loads the library through `postcss-loader` now

**Date**: 20th of October, 2026

**Problem**:

- Decision 1 added the CommonJS build for `postcss-loader`
  - It loaded the library, then named `@asd14/tailwind-gruvbox`, as a PostCSS
    plugin
- No app loads the library through `postcss-loader` now

**Solution**:

- Drop `build:src:cjs` and the `require` entries in `exports`
