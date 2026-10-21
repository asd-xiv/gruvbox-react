import type { FC } from "react"

import { useColorScheme } from "../../hooks/color-scheme/hook.js"
import type { ColorScheme } from "../../hooks/color-scheme/hook.js"
import { icons } from "../../icons/nerd.js"
import { TriStateSwitch } from "../tri-state-switch/tri-state-switch.js"
import type { TriStateSwitchProps } from "../tri-state-switch/tri-state-switch.js"

const OPTIONS: TriStateSwitchProps<ColorScheme>["options"] = [
  { value: "dark", label: "Dark", icon: icons.fa.moon },
  { value: "system", label: "System", icon: icons.fa.desktop },
  { value: "light", label: "Light", icon: icons.fa.sun },
]

type ColorSchemeSwitchProps = {
  className?: string
}

/**
 * Switch the color scheme between dark, system and light.
 *
 * @example
 * ```tsx
 * <ColorSchemeSwitch />
 * ```
 */
const ColorSchemeSwitch: FC<ColorSchemeSwitchProps> = ({ className }) => {
  const [{ colorScheme }, { setColorScheme }] = useColorScheme()

  return (
    <TriStateSwitch
      className={className}
      label="Color scheme"
      options={OPTIONS}
      value={colorScheme}
      onChange={setColorScheme}
    />
  )
}

ColorSchemeSwitch.displayName = "GruvboxColorSchemeSwitch"

export { ColorSchemeSwitch }
export type { ColorSchemeSwitchProps }
