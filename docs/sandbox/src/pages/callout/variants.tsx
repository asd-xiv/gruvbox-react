import { Callout } from "@asd14/gruvbox-react/ui"

const CalloutVariants = () => (
  <>
    <Callout variant="note">Read the summary before the details.</Callout>
    <Callout variant="tip">Press Tab to move to the next field.</Callout>
    <Callout variant="important">Save before you close the window.</Callout>
    <Callout variant="warning">The import replaces every row.</Callout>
    <Callout variant="caution">You cannot undo a deleted project.</Callout>
  </>
)

export { CalloutVariants }
