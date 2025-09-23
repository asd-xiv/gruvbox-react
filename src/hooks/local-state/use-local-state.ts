/* eslint-disable no-underscore-dangle */
// Using _data as a wrapper property for localStorage serialization

import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

type LocalState<T> = {
  _data?: T
}

/**
 * Sister hook to React's `useState` with Local Storage persistence.
 *
 * Automatically persists state changes to localStorage and restores state
 * from localStorage on component mount. Handles corrupted data gracefully
 * by falling back to the default value.
 *
 * @param id - Unique identifier for the localStorage key (prefixed with 'use-local-storage_')
 * @param defaultValue - Default value to use when no localStorage data exists or data is corrupted
 * @returns Tuple of [state, setState] similar to useState
 *
 * @example
 * ```tsx
 * // Simple string storage
 * const [name, setName] = useLocalState("userName", "Anonymous")
 *
 * // Complex object storage
 * const [settings, setSettings] = useLocalState("userSettings", {
 *   theme: "dark",
 *   language: "en"
 * })
 *
 * // Updates automatically persist to localStorage
 * setName("John Doe")
 * setSettings({ theme: "light", language: "es" })
 * ```
 */
const useLocalState = <T>(
  id: string,
  defaultValue?: T
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const finalLSKey = `use-local-storage_${id}`
  const [state, setState] = useState<T | undefined>(() => {
    try {
      /*
       * Initialize state with existing persisted data from previous sessions.
       */
      const previousLocalState = JSON.parse(
        window.localStorage.getItem(finalLSKey) ?? "{}"
      ) as LocalState<T>

      if (!Object.hasOwn(previousLocalState, "_data")) {
        throw new Error(`Local storage key with id: ${id} does not exist`)
      }

      return previousLocalState._data
    } catch (_) {
      /*
       * If anything went wrong, key does not exist, saved data is not expected
       * shape, return and persist the default value.
       */
      window.localStorage.setItem(
        finalLSKey,
        JSON.stringify({ _data: defaultValue })
      )

      return defaultValue
    }
  })

  /*
   * Persist to Local Storage when value changes.
   */
  useEffect(() => {
    window.localStorage.setItem(finalLSKey, JSON.stringify({ _data: state }))
  }, [finalLSKey, state])

  return [state, setState]
}

export { useLocalState }
