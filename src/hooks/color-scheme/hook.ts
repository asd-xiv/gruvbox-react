import { useMemo, useSyncExternalStore } from "react"

import {
  readIsSystemDarkMode,
  subscribeToSystemDarkMode,
} from "./utils/system-dark-mode.js"
import {
  readColorScheme,
  subscribeToColorScheme,
  writeColorScheme,
} from "./utils/user-choice.js"
import type { ColorScheme } from "./utils/user-choice.js"

/**
 * Return true when the color scheme is "dark", or when it is "system" and the
 * system is dark.
 */
const resolveIsDarkMode = (
  colorScheme: ColorScheme,
  isSystemDarkMode: boolean
) => (colorScheme === "system" ? isSystemDarkMode : colorScheme === "dark")

type ColorSchemeState = {
  colorScheme: ColorScheme

  /**
   * The user's choice wins over the system's. "system" follows the system
   */
  isDarkMode: boolean
}

type ColorSchemeActions = {
  /**
   * Save the color scheme. "system" drops the user's choice
   */
  setColorScheme: (colorScheme: ColorScheme) => void
  toggleDarkMode: () => void
}

/**
 * Every `useColorScheme` call returns this one object. Its identity never
 * changes, so React never re-runs an effect that lists it as a dependency.
 */
const colorSchemeActions: ColorSchemeActions = {
  setColorScheme: writeColorScheme,

  toggleDarkMode: () => {
    const isDarkMode = resolveIsDarkMode(
      readColorScheme(),
      readIsSystemDarkMode()
    )

    writeColorScheme(isDarkMode ? "light" : "dark")
  },
}

/**
 * Read and set the color scheme, in the shape of `useState`. `<ColorSchemeRoot>`
 * renders the result for the library styles.
 *
 * Every `useColorScheme` call reads the same two sources, localStorage and the
 * system. So all calls return one color scheme without a React context or a
 * state library. Nothing runs on import.
 *
 * @example
 * ```tsx
 * const DarkModeButton = () => {
 *   const [{ isDarkMode }, { toggleDarkMode }] = useColorScheme()
 *
 *   return (
 *     <button onClick={toggleDarkMode}>
 *       {isDarkMode ? "Light" : "Dark"}
 *     </button>
 *   )
 * }
 * ```
 */
const useColorScheme = (): readonly [ColorSchemeState, ColorSchemeActions] => {
  // One call per source. React compares each snapshot by identity, so one
  // getter that builds a new object on each read makes it re-render forever
  const colorScheme = useSyncExternalStore(
    subscribeToColorScheme,
    readColorScheme
  )
  const isSystemDarkMode = useSyncExternalStore(
    subscribeToSystemDarkMode,
    readIsSystemDarkMode
  )
  const isDarkMode = resolveIsDarkMode(colorScheme, isSystemDarkMode)

  const state = useMemo(
    () => ({ colorScheme, isDarkMode }),
    [colorScheme, isDarkMode]
  )

  return [state, colorSchemeActions]
}

export { useColorScheme }
export type { ColorScheme, ColorSchemeState, ColorSchemeActions }
