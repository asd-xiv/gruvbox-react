import { createContext, useEffect, useMemo, useState } from "react"
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react"

/**
 * System-level dark mode media query
 */
const DARK_MODE_MEDIA = window.matchMedia("(prefers-color-scheme: dark)")

/**
 * Dark mode state and actions
 */
type DarkModeActions = {
  setDarkMode: Dispatch<SetStateAction<boolean>>
  toggleDarkMode: () => void
}

type DarkModeContextType = [boolean, DarkModeActions]

/**
 * Controls how dark mode behaves and persists
 */
type DarkModeProviderProps = {
  /**
   * localStorage key for dark mode preference
   *
   * @default "gruvbox-react_dark-mode"
   */
  storageKey?: string

  /**
   * Initial theme preference
   *
   * @default "system"
   */
  colorScheme?: "dark" | "light" | "system"
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

/**
 * Manages dark mode state and syncs with system preferences
 *
 * @example
 * ```tsx
 * <DarkModeProvider colorScheme="system">
 *   <YourApp />
 * </DarkModeProvider>
 * ```
 */
const DarkModeProvider: FC<PropsWithChildren<DarkModeProviderProps>> = ({
  storageKey = "gruvbox-react_dark-mode",
  colorScheme = "system",
  children,
}) => {
  // Initialize state from local storage or fallback to system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedPreference = localStorage.getItem(storageKey)
    if (savedPreference) return savedPreference === "true"

    return colorScheme === "system"
      ? DARK_MODE_MEDIA.matches
      : colorScheme === "dark"
  })

  // Update isDarkMode on system changes
  useEffect(() => {
    if (colorScheme !== "system") return

    const syncWithSystem = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    DARK_MODE_MEDIA.addEventListener("change", syncWithSystem)
    return () => {
      DARK_MODE_MEDIA.removeEventListener("change", syncWithSystem)
    }
  }, [colorScheme])

  // Persist isDarkMode to local storage
  useEffect(() => {
    localStorage.setItem(storageKey, String(isDarkMode))
  }, [isDarkMode, storageKey])

  // Update data-theme attribute on document body
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light"
    document.body.setAttribute("data-theme", theme)

    // Cleanup: remove attribute on unmount
    return () => {
      document.body.removeAttribute("data-theme")
    }
  }, [isDarkMode])

  const actions = useMemo<DarkModeActions>(
    () => ({
      setDarkMode: setIsDarkMode,
      toggleDarkMode: () => {
        setIsDarkMode(previous => !previous)
      },
    }),
    [setIsDarkMode]
  )

  const value = useMemo<DarkModeContextType>(
    () => [isDarkMode, actions],
    [isDarkMode, actions]
  )

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
}

export { DarkModeContext, DarkModeProvider }
export type { DarkModeActions, DarkModeContextType, DarkModeProviderProps }
