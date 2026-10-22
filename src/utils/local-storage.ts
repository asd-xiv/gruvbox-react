/**
 * `writeToStorage` fires this event on each write in this tab. The browser
 * fires `storage` only for writes in other tabs
 */
const UPDATE_EVENT = "gvb-local-storage:update"

/**
 * Read the string stored under `key`, without parsing it. Return `undefined`
 * when the key is missing or the browser blocks storage.
 *
 * Two reads of one stored string are equal under `Object.is`, so React can use
 * the string as a `useSyncExternalStore` snapshot.
 */
const readFromStorage = (key: string): string | undefined => {
  try {
    return localStorage.getItem(key) ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Write a value to localStorage as JSON, then tell the subscribers in this
 * tab. Pass `undefined` to drop the key.
 *
 * Skip the write without throwing when the browser blocks storage or the quota
 * is full.
 *
 * @example
 * ```ts
 * writeToStorage("model-open", true)
 * // localStorage["model-open"] === "true"
 *
 * writeToStorage("model-open", undefined)
 * // localStorage["model-open"] === undefined
 * ```
 */
const writeToStorage = (key: string, value: unknown) => {
  try {
    if (value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch {
    // The browser blocks storage or the quota is full
  }

  // A `StorageEvent`, so one handler reads this event and the browser's
  window.dispatchEvent(new window.StorageEvent(UPDATE_EVENT, { key }))
}

/**
 * Call `listener` on each write to `key`, in this tab or another. Return a
 * function that stops the calls.
 */
const subscribeToStorage = (key: string, listener: () => void) => {
  // `event.key` is null when another tab clears localStorage
  const handleWrite = (event: Event) => {
    if (
      event instanceof window.StorageEvent &&
      (event.key === key || event.key === null)
    ) {
      listener()
    }
  }

  window.addEventListener(UPDATE_EVENT, handleWrite)
  window.addEventListener("storage", handleWrite)

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleWrite)
    window.removeEventListener("storage", handleWrite)
  }
}

export { readFromStorage, subscribeToStorage, writeToStorage }
