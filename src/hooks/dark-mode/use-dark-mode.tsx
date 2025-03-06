import { useContext } from "react"
import { DarkModeContext } from "./dark-mode-provider.js"
import type { DarkModeContextType } from "./dark-mode-provider.js"

/**
 * Access and interact with dark mode state.
 *
 * - Default state is determined by user's system preferences
 * via `prefers-color-scheme` media query;
 * - Local storage is used for long term persistence between sessions
 * - State is updated/overwritten on system preference change;
 *
 * @returns [isDarkMode, setIsDarkMode]
 *
 * @example
 * ```tsx
 * const [isDark, setIsDark] = useDarkMode()
 *
 * <button onClick={() => setIsDark(prev => !prev)}>
 *   {isDark ? "Light Mode" : "Dark Mode"}
 * </button>
 * ```
 */
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}
