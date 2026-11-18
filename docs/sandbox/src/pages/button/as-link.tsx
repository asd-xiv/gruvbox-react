import { Button } from "@asd14/gruvbox-react/ui"

const ButtonAsLink = () => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content -- Base UI fills the anchor with the children
  <Button variant="outline" render={<a href="#card" />}>
    Go to Card
  </Button>
)

export { ButtonAsLink }
