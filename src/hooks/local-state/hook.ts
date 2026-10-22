import { useCallback, useMemo, useSyncExternalStore } from "react"

import {
  readFromStorage,
  subscribeToStorage,
  writeToStorage,
} from "../../utils/local-storage.js"
import { parseJson } from "../../utils/parse-json.js"
import type { ParseJsonProps } from "../../utils/parse-json.js"

/**
 * The server has no localStorage so return `undefined` to inherit the hook's
 * `defaultValue` until hydration finishes.
 */
const getServerSnapshot = () => undefined

/**
 * A hook for persisting data across tab reloads and browser restarts.
 *
 * It works like `useState`, kept in localStorage under `key`. Every hook
 * with the same `key` shares one value, in this tab and in the others.
 *
 * @example
 * ```tsx
 * const [isModelOpen, setIsModelOpen] = useLocalState("model-open", {
 *   isValid: value => typeof value === "boolean",
 *   defaultValue: true,
 * })
 *
 * setIsModelOpen(false)
 * setIsModelOpen(undefined) // back to open
 *
 * // For an object value, keep the props outside the component, or memoize
 * // them. New props on each render parse a new object on each render
 * const SETTINGS_PROPS = {
 *   isValid: isSettings,
 *   defaultValue: { language: "en" },
 * }
 *
 * const Settings: FC = () => {
 *   const [settings] = useLocalState("settings", SETTINGS_PROPS)
 *
 *   return <p>{settings.language}</p>
 * }
 * ```
 */
const useLocalState = <T>(
  key: string,
  { isValid, defaultValue }: ParseJsonProps<T>
): readonly [T, (value: T | undefined) => void] => {
  const subscribe = useCallback(
    (listener: () => void) => subscribeToStorage(key, listener),
    [key]
  )

  // The stored string is the snapshot. A parsed object is new on each read, so
  // React would re-render forever
  const stored = useSyncExternalStore(
    subscribe,
    () => readFromStorage(key),
    getServerSnapshot
  )

  // Parse only for a new stored string, `isValid` or `defaultValue`
  const value = useMemo(
    () => parseJson(stored, { isValid, defaultValue }),
    [stored, isValid, defaultValue]
  )

  const setValue = useCallback(
    (nextValue: T | undefined) => {
      writeToStorage(key, nextValue)
    },
    [key]
  )

  return [value, setValue]
}

export { useLocalState }
