/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import { useCallback } from "react"

/**
 * Hook for dispatching custom events with arbitrary payloads
 * on the window object.
 *
 * @param eventName - The name of the custom event to dispatch
 * @returns A callback function that dispatches the custom event
 *
 * @example
 * type LoginPayload = { userId: string; timestamp: number }
 *
 * const dispatchLoginEvent = useCustomEventDispatcher<LoginPayload>("login")
 * dispatchLoginEvent({ userId: "123", timestamp: Date.now() })
 *
 * // Listen using vanilla JavaScript:
 * window.addEventListener("login", (event) => {
 *   console.log("Login event received:", event.detail)
 *   // => { userId: "123", timestamp: 1234567890 }
 * })
 *
 * // Listen using `useCustomEventListener` hook:
 * useDomEventsListener({
 *   "login": (payload: LoginPayload) => {
 *     console.log("Login event received:", payload)
 *     // => { userId: "123", timestamp: 1234567890 }
 *   },
 * })
 */
export const useDomEventsDispatcher = <T>(eventName: string) => {
  // Memoize the callback function to avoid unnecessary re-renders when
  // used as a dependency in other upstream components
  return useCallback(
    (payload: T) => {
      window.dispatchEvent(new CustomEvent(eventName, { detail: payload }))
    },
    [eventName]
  )
}
