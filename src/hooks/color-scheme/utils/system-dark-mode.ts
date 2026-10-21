const SYSTEM_DARK_MODE_QUERY = "(prefers-color-scheme: dark)"

const readIsSystemDarkMode = () =>
  window.matchMedia(SYSTEM_DARK_MODE_QUERY).matches

/**
 * Call `listener` when the system dark mode changes.
 */
const subscribeToSystemDarkMode = (listener: () => void) => {
  const systemDarkModeMedia = window.matchMedia(SYSTEM_DARK_MODE_QUERY)
  systemDarkModeMedia.addEventListener("change", listener)

  return () => {
    systemDarkModeMedia.removeEventListener("change", listener)
  }
}

export { readIsSystemDarkMode, subscribeToSystemDarkMode }
