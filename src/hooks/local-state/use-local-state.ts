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
 * @param id Local Storage key/namespace
 * @param defaultValue
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
