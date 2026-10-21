import {
  readFromStorage,
  writeToStorage,
} from "../../../utils/local-storage.js"

type ColorScheme = "light" | "dark" | "system"

const STORAGE_KEY = "color-scheme"
const UPDATE_EVENT = "gvb-color-scheme:update"

/**
 * Return the user's choice, "light" or "dark", or "system" when localStorage
 * holds no valid choice.
 */
const readColorScheme = () =>
  readFromStorage<ColorScheme>(STORAGE_KEY, {
    isValid: value => value === "light" || value === "dark",
    defaultValue: "system",
  })

/**
 * Save the user's choice, then tell every hook in this tab. "system" drops
 * the choice.
 */
const writeColorScheme = (colorScheme: ColorScheme) => {
  writeToStorage(
    STORAGE_KEY,
    colorScheme === "system" ? undefined : colorScheme
  )
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

/**
 * Call `listener` when the user's choice changes, in this tab or another.
 */
const subscribeToColorScheme = (listener: () => void) => {
  window.addEventListener(UPDATE_EVENT, listener)
  window.addEventListener("storage", listener)

  return () => {
    window.removeEventListener(UPDATE_EVENT, listener)
    window.removeEventListener("storage", listener)
  }
}

export { readColorScheme, writeColorScheme, subscribeToColorScheme }
export type { ColorScheme }
