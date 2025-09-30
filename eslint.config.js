import { reactConfig, commonIgnores } from "@asd14/eslint-config/react"

const SRC_FILES = ["src/**/*.{ts,tsx}"]
const TEST_FILES = ["src/**/*.test.{ts,tsx}"]
const DEV_FILES = ["eslint.config.js", "jsdom.config.js"]

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [...commonIgnores],
  },
  {
    ...reactConfig,
    files: [...SRC_FILES, ...TEST_FILES, ...DEV_FILES],
    rules: {
      ...reactConfig.rules,
      // Disable since it conflicts with forwardRef usage, see DECISIONS#2
      "react/require-default-props": "off",
    },
  },
]
