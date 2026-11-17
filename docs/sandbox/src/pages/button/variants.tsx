import { Button } from "@asd14/gruvbox-react/ui"

const ButtonVariants = () => (
  <div className="flex flex-wrap gap-2">
    <Button>Save</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="outline">Preview</Button>
    <Button variant="destructive">Delete</Button>
    <Button variant="ghost">Skip</Button>
    <Button variant="link">Read more</Button>
  </div>
)

export { ButtonVariants }
