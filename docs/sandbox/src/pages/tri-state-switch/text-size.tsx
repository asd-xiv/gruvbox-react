import { TriStateSwitch } from "@asd14/gruvbox-react/ui"
import { useState } from "react"

type TextSize = "sm" | "md" | "lg"

const TriStateSwitchTextSize = () => {
  const [size, setSize] = useState<TextSize>("md")

  return (
    <TriStateSwitch
      label="Text size"
      options={[
        { value: "sm", label: "Small", icon: "S" },
        { value: "md", label: "Medium", icon: "M" },
        { value: "lg", label: "Large", icon: "L" },
      ]}
      value={size}
      onChange={setSize}
    />
  )
}

export { TriStateSwitchTextSize }
