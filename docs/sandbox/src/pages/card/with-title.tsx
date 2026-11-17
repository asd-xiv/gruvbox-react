import { Button, Card } from "@asd14/gruvbox-react/ui"

const CardWithTitle = () => (
  <Card title="Unsaved changes">
    <div className="flex items-center gap-2">
      <Button>Save</Button>
      <Button variant="ghost">Discard</Button>
    </div>
  </Card>
)

export { CardWithTitle }
