import path from "node:path"
import {
  reactConfig,
  devConfig,
  getIgnorePatterns,
} from "@asd14/eslint-config/react"

const SRC_FILES = ["src/**/*.{ts,tsx}"]
const TEST_FILES = ["src/**/*.test.{ts,tsx}"]
const DEV_FILES = ["eslint.config.js", "jsdom.config.js", "postcss.config.js"]

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: getIgnorePatterns(path.join(import.meta.dirname, ".gitignore")),
  },
  {
    files: SRC_FILES,
    ...reactConfig,
    rules: {
      ...reactConfig.rules,

      // React 19 dropped defaultProps for function components
      "react/require-default-props": "off",
    },
  },
  {
    files: [...TEST_FILES, ...DEV_FILES],
    ...reactConfig,
    ...devConfig,
    rules: {
      ...reactConfig.rules,
      ...devConfig.rules,

      // React 19 dropped defaultProps for function components
      "react/require-default-props": "off",
    },
  },
]
