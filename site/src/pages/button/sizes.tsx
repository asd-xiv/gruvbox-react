import { icons } from "@asd14/gruvbox-react/icons-nerd"
import { Button } from "@asd14/gruvbox-react/ui"

const ButtonSizes = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Settings">
      <span aria-hidden="true">{icons.oct.gear}</span>
    </Button>
    <Button disabled={true}>Disabled</Button>
  </div>
)

export { ButtonSizes }
