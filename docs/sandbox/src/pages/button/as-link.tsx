import { Button } from "@asd14/gruvbox-react/ui"

const ButtonAsLink = () => (
  <Button variant="outline" render={<a href="#card" />}>
    Go to Card
  </Button>
)

export { ButtonAsLink }
