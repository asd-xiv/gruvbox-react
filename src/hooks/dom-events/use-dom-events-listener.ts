import { useEffect } from "react"

type CustomEvent<T extends Record<string, unknown> = Record<string, unknown>> =
  Event & {
    detail?: T
  }

type CustomEventHandlers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: (payload: any) => void
}

/**
 * Hook for reacting to custom events dispatched on the window object.
 *
 * @param eventHandlers - An object mapping event names to their handler functions
 *
 * @example
 * useDomEventsListener({
 *   "custom-event": payload => console.log(payload),
 * })
 */
export const useDomEventsListener = (eventHandlers: CustomEventHandlers) => {
  useEffect(() => {
    // For each event handler, create a listener and attach it to window
    const listeners = Object.entries(eventHandlers).map(([name, handler]) => {
      const listener = (event: CustomEvent) => {
        handler(event.detail)
      }
      window.addEventListener(name, listener)
      return { name, listener }
    })

    // Cleanup to remove event listeners when component unmounts
    return () => {
      listeners.forEach(({ name, listener }) => {
        window.removeEventListener(name, listener)
      })
    }
  }, [eventHandlers])
}
