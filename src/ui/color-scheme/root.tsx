import type { ReactNode, FC } from "react"

import { useColorScheme } from "../../hooks/color-scheme/hook.js"

type ColorSchemeRootProps = {
  children: ReactNode
  className?: string
}

/**
 * Render the element the library styles live in. It holds the resolved color
 * scheme in `data-gvb-color-scheme`, so the children render with the right
 * colors in the same commit.
 *
 * Render it once, around the app. When the app owns the page, pass a class
 * with `min-height: 100dvh`, so the background covers it. The library utility
 * classes, eg. `flex`, style the elements inside the root, not the root
 * itself, so define that class in the app's CSS. Mark an element inside with
 * `data-gvb-boundary` to stop the library styles there.
 *
 * @example
 * ```tsx
 * <ColorSchemeRoot className={css.page}>
 *   <App />
 *   <div data-gvb-boundary id="other-app" />
 * </ColorSchemeRoot>
 * ```
 */
const ColorSchemeRoot: FC<ColorSchemeRootProps> = ({ children, className }) => {
  const [{ isDarkMode }] = useColorScheme()

  return (
    <div
      className={className}
      data-gvb-color-scheme={isDarkMode ? "dark" : "light"}>
      {children}
    </div>
  )
}

ColorSchemeRoot.displayName = "GruvboxColorSchemeRoot"

export { ColorSchemeRoot }
export type { ColorSchemeRootProps }
