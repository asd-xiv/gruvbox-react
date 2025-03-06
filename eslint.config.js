import { reactConfig, reactJestConfig } from "@asd14/eslint-config"

/**
 * ESLint configuration for React project with Jest testing
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ...reactConfig,
    files: ["src/**/*.{ts,tsx}", "eslint.config.js", "jest.config.js"],
    languageOptions: {
      ...reactConfig.languageOptions,
      parserOptions: {
        ...reactConfig.languageOptions.parserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactConfig.rules,
      // Disable since it conflicts with forwardRef usage, see D#2
      "react/require-default-props": "off",
    },
  },
  {
    ...reactJestConfig,
    files: ["src/**/*.test.{js,ts}"],
  },
]

// NOTE 󱇽: Added descriptive JSDoc comment and improved file pattern readability through array formatting
