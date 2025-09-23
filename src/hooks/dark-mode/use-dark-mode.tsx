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
 * - Automatically sets `data-theme` attribute on document body
 *
 * @returns [isDarkMode, { setDarkMode, toggleDarkMode }]
 *
 * @example
 * ```tsx
 * const [isDark, { setDarkMode, toggleDarkMode }] = useDarkMode()
 *
 * // Toggle between themes
 * <button onClick={toggleDarkMode}>
 *   {isDark ? "Light Mode" : "Dark Mode"}
 * </button>
 *
 * // Set specific theme
 * <button onClick={() => setDarkMode(false)}>
 *   Force Light Mode
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
