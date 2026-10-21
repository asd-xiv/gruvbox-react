import { useId } from "react"
import type { ReactNode } from "react"

import css from "./tri-state-switch.module.css"
import { cn } from "../../utils/cn.js"

type TriStateSwitchOption<T extends string> = {
  value: T
  /** Name of the option for screen readers and the hover title */
  label: string
  /** Shown in the switch. Without it, the switch shows the label */
  icon?: ReactNode
}

type TriStateSwitchProps<T extends string> = {
  options: readonly [
    TriStateSwitchOption<T>,
    TriStateSwitchOption<T>,
    TriStateSwitchOption<T>,
  ]
  value: T
  onChange: (value: T) => void
  /** Name of the switch for screen readers */
  label: string
  className?: string
}

/**
 * A generic component, so `FC<Props>` cannot type it. `T` flows from
 * `options` to `value` and `onChange`, so the caller needs no cast
 */
type TriStateSwitchUI = {
  <T extends string>(props: TriStateSwitchProps<T>): ReactNode
  displayName?: string
}

/**
 * Switch with three positions and a thumb that slides to the checked one. Each
 * position is a native radio, so the arrow keys move between them.
 *
 * @example
 * ```tsx
 * <TriStateSwitch
 *   label="Text size"
 *   options={[
 *     { value: "sm", label: "Small", icon: "S" },
 *     { value: "md", label: "Medium", icon: "M" },
 *     { value: "lg", label: "Large", icon: "L" },
 *   ]}
 *   value={size}
 *   onChange={setSize}
 * />
 * ```
 */
const TriStateSwitch: TriStateSwitchUI = ({
  options,
  value,
  onChange,
  label,
  className,
}) => {
  const name = useId()

  return (
    <div
      className={cn(css["switch"], className)}
      role="radiogroup"
      aria-label={label}>
      <span className={css["thumb"]} aria-hidden="true" />
      {options.map(option => (
        <label
          key={option.value}
          className={css["option"]}
          title={option.label}>
          <input
            className={css["input"]}
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            aria-label={option.label}
            onChange={() => {
              onChange(option.value)
            }}
          />
          <span aria-hidden="true">{option.icon ?? option.label}</span>
        </label>
      ))}
    </div>
  )
}

TriStateSwitch.displayName = "GruvboxTriStateSwitch"

export { TriStateSwitch }
export type { TriStateSwitchOption, TriStateSwitchProps }
