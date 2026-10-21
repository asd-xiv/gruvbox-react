/**
 * Prefix of every key the library writes, so its keys never match the app's
 * keys
 */
const KEY_PREFIX = "gvb-local-storage"

type ReadFromStorageProps<T> = {
  /**
   * Type predicate for the parsed value. TypeScript infers `T` from it and
   * from `defaultValue`. For a Valibot schema, pass
   * `value => v.is(schema, value)`
   */
  isValid: (value: unknown) => value is T

  /**
   * Value to return when the key is missing, the JSON does not parse,
   * `isValid` rejects the value or the browser blocks storage. Pass a function
   * to compute it only then. JSON holds no functions, so `T` is never one
   */
  defaultValue: T | (() => T)
}

/**
 * Read a JSON value from localStorage. Return `defaultValue` when the read
 * fails.
 *
 * @example
 * ```ts
 * writeToStorage("dark-mode", true)
 *
 * readFromStorage("dark-mode", {
 *   isValid: value => typeof value === "boolean",
 *   defaultValue: undefined,
 * })
 * // => true, typed `boolean | undefined`
 *
 * readFromStorage("font-size", {
 *   isValid: value => typeof value === "number",
 *   defaultValue: () => window.innerWidth > 1200 ? 16 : 14,
 * })
 * // => 14 on a narrow screen, typed `number`
 * ```
 */
const readFromStorage = <T>(
  key: string,
  { isValid, defaultValue }: ReadFromStorageProps<T>
): T => {
  const getDefaultValue = () =>
    defaultValue instanceof Function ? defaultValue() : defaultValue

  try {
    const storedJson = localStorage.getItem(`${KEY_PREFIX}_${key}`)
    if (storedJson === null) return getDefaultValue()

    const value: unknown = JSON.parse(storedJson)
    return isValid(value) ? value : getDefaultValue()
  } catch {
    return getDefaultValue()
  }
}

/**
 * Write a value to localStorage as JSON. Pass `undefined` to drop the key.
 *
 * Skip the write without throwing when the browser blocks storage or the quota
 * is full.
 *
 * @example
 * ```ts
 * writeToStorage("dark-mode", true)
 * // localStorage["gvb-local-storage_dark-mode"] === "true"
 *
 * writeToStorage("dark-mode", undefined)
 * // localStorage["gvb-local-storage_dark-mode"] === undefined
 * ```
 */
const writeToStorage = (key: string, value: unknown) => {
  try {
    if (value === undefined) {
      localStorage.removeItem(`${KEY_PREFIX}_${key}`)
    } else {
      localStorage.setItem(`${KEY_PREFIX}_${key}`, JSON.stringify(value))
    }
  } catch {
    // The browser blocks storage or the quota is full. Skip the write
  }
}

export { readFromStorage, writeToStorage }
