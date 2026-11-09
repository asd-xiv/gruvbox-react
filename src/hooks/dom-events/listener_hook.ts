import { useEffect, useRef } from "react"

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
  // A caller often passes a new object on each render. The listeners call the
  // latest handlers through this ref, so a new object does not re-add them
  const handlersRef = useRef(eventHandlers)
  const eventNames = Object.keys(eventHandlers).join("\n")

  useEffect(() => {
    handlersRef.current = eventHandlers
  })

  // Re-add the listeners only when the event names change
  useEffect(() => {
    // For each event handler, create a listener and attach it to window
    const listeners = Object.keys(handlersRef.current).map(name => {
      const listener = (event: CustomEvent) => {
        handlersRef.current[name]?.(event.detail)
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
  }, [eventNames])
}
