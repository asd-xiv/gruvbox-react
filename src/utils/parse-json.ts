type ParseJsonProps<T> = {
  /**
   * Type predicate for the parsed value.
   */
  isValid: (value: unknown) => value is T

  /**
   * Value to return when there is no text, the text is not valid JSON or
   * `isValid` rejects the value. Pass a function to compute it only then.
   */
  defaultValue: T | (() => T)
}

/**
 * Parse JSON text and check the value. Return `defaultValue` when `text` is
 * `undefined`, is not valid JSON or `isValid` rejects the value.
 *
 * @example
 * ```ts
 * parseJson("true", {
 *   isValid: value => typeof value === "boolean",
 *   defaultValue: false,
 * })
 * // => true
 *
 * parseJson(undefined, {
 *   isValid: value => typeof value === "number",
 *   defaultValue: () => (window.innerWidth > 1200 ? 16 : 14),
 * })
 * // => 14 on a narrow screen
 * ```
 */
const parseJson = <T>(
  text: string | undefined,
  { isValid, defaultValue }: ParseJsonProps<T>
): T => {
  const getDefaultValue = () =>
    defaultValue instanceof Function ? defaultValue() : defaultValue

  if (text === undefined) {
    return getDefaultValue()
  }

  try {
    const value: unknown = JSON.parse(text)
    return isValid(value) ? value : getDefaultValue()
  } catch {
    return getDefaultValue()
  }
}

export { parseJson }
export type { ParseJsonProps }
