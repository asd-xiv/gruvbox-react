import type { ParseJsonProps } from "../../../utils/parse-json.js"

type ColorScheme = "light" | "dark" | "system"

/**
 * The `gvb` prefix keeps the key apart from the app's keys
 */
const COLOR_SCHEME_KEY = "gvb-color-scheme"

/**
 * Accept "light", "dark" or "system". No stored value, or any other, means
 * "system"
 */
const COLOR_SCHEME_PROPS: ParseJsonProps<ColorScheme> = {
  isValid: (value): value is ColorScheme =>
    value === "light" || value === "dark" || value === "system",
  defaultValue: "system",
}

export { COLOR_SCHEME_KEY, COLOR_SCHEME_PROPS }
export type { ColorScheme }
