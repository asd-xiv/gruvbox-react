import { useSyncExternalStore } from "react"

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)

  return () => {
    window.removeEventListener("hashchange", onChange)
  }
}

const readHash = () => window.location.hash.slice(1)

/**
 * Read the part of the URL after `#`, eg. `button` on `/#button`. Every call
 * reads the one URL, and renders again when it changes.
 *
 * @example
 * const Page = () => {
 *   const hash = useHash()
 *
 *   return <p>{hash === "" ? "Home" : hash}</p>
 * }
 */
const useHash = (): string =>
  useSyncExternalStore(subscribeToHash, readHash, () => "")

export { useHash }
