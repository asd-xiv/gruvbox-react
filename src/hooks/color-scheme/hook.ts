import { useCallback, useSyncExternalStore } from "react"

import { useLocalState } from "../local-state/hook.js"
import {
  readIsSystemDarkMode,
  subscribeToSystemDarkMode,
} from "./utils/system-dark-mode.js"
import { COLOR_SCHEME_KEY, COLOR_SCHEME_PROPS } from "./utils/user-choice.js"
import type { ColorScheme } from "./utils/user-choice.js"

type ColorSchemeState = {
  colorScheme: ColorScheme
  isDarkMode: boolean
}

type ColorSchemeActions = {
  setColorScheme: (colorScheme: ColorScheme) => void
  toggleDarkMode: () => void
}

/**
 * The server has no `matchMedia`. It renders the light scheme, and so does the
 * browser while it hydrates, before it reads the system's dark mode
 */
const getServerIsSystemDarkMode = () => false

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
  // User setting (read from local storage)
  const [colorScheme, setColorScheme] = useLocalState(
    COLOR_SCHEME_KEY,
    COLOR_SCHEME_PROPS
  )

  // System setting (read from browser API)
  const isSystemDarkMode = useSyncExternalStore(
    subscribeToSystemDarkMode,
    readIsSystemDarkMode,
    getServerIsSystemDarkMode
  )

  // User choice takes precedence, otherwise derive from system setting
  const isDarkMode =
    colorScheme === "system" ? isSystemDarkMode : colorScheme === "dark"

  // Changes only when `isDarkMode` flips
  const toggleDarkMode = useCallback<
    ColorSchemeActions["toggleDarkMode"]
  >(() => {
    setColorScheme(isDarkMode ? "light" : "dark")
  }, [isDarkMode, setColorScheme])

  return [
    { colorScheme, isDarkMode },
    { setColorScheme, toggleDarkMode },
  ]
}

export { useColorScheme }
export type { ColorScheme, ColorSchemeState, ColorSchemeActions }
