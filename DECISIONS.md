# `@asd14/gruvbox-react` package decisions

This file contains details about why certain package decisions where taken.

<!-- vim-markdown-toc GFM -->

* [1. Add separate CJS build](#1-add-separate-cjs-build)
* [2. Disable `react/require-default-props`](#2-disable-reactrequire-default-props)

<!-- vim-markdown-toc -->

## 1. Add separate CJS build

**Date**: 2nd of January, 2025

Split `build:src` npm script into `build:src:esm` and `build:src:cjs`. Each
configuring `swc` to build for a specific module loader.

This is needed because `postcss-loader` used in webpack is CommonJS only and
will error when trying to import an ESM only package.

```
Error: Module build failed (from ../../../../node_modules/postcss-loader/dist/cjs.js):
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in node_modules/@asd14/tailwind-gruvbox/package.json
    at exportsNotFound (node:internal/modules/esm/resolve:304:10)
```

## 2. Disable `react/require-default-props`

**Date**: 3rd of January, 2025

This rule aims to ensure that any non-required prop types of a component has a
corresponding `defaultProps` value.

While it works with functional components, it does not work with `forwardRef` 
which we are using in every UI component. 

See more: https://github.com/jsx-eslint/eslint-plugin-react/issues/2856
