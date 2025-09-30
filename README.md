[![Release](https://github.com/asd-xiv/gruvbox-react/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/asd-xiv/gruvbox-react/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/@asd14/gruvbox-react.svg)](https://www.npmjs.com/package/@asd14/gruvbox-react)

# @asd14/gruvbox-react

> :computer: Terminal/Gruvbox inspired React UI kit :sparkles:

- :art: [Gruvbox][intro_gruv] color scheme
- :zap: [Postcss][intro_postcss] is all you need

[intro_gruv]: https://github.com/morhetz/gruvbox
[intro_postcss]: https://github.com/postcss/postcss

## Table of contents

<!-- vim-markdown-toc GFM -->

- [Design Principles](#design-principles)
- [Installation](#installation)
  - [Peer dependencies](#peer-dependencies)
- [Usage](#usage)
- [Changelog](#changelog)
- [License](#license)

<!-- vim-markdown-toc -->

## Design Principles

- **Terminal-inspired**: Clean, high-contrast design with consistent spacing and
  typography
- **No transparencies or derivative colors**: Only colors from the Gruvbox
  palette

## Installation

```sh
npm install @asd14/gruvbox-react
```

### Peer dependencies

This package requires and assumes you already installed:

```json
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19",
    "lucide-react": "^0.544",
  },
```

## Usage

```tsx
// src/index.tsx
import { DarkModeProvider, useDarkMode } from "@asd14/gruvbox-react/hooks"
import { Button, Header1, Callout } from "@asd14/gruvbox-react/ui"
import { Sun, Moon } from "@asd14/gruvbox-react/icons-lucide"

const MyComponent = () => {
  const [isDark, { toggleDarkMode }] = useDarkMode()

  return (
    <div>
      <Header1>Terminal UI</Header1>

      <Button onClick={toggleDarkMode} variant="outline">
        {isDark ? <Sun /> : <Moon />}
        Toggle Theme
      </Button>

      <Callout variant="tip">
        This uses Gruvbox colors and terminal-style design
      </Callout>
    </div>
  )
}

const App = () => {
  return (
    <DarkModeProvider>
      <MyComponent />
    </DarkModeProvider>
  )
}
```

## Changelog

See the [releases section](https://github.com/asd-xiv/gruvbox-react/releases)
for details.

## License

MIT
