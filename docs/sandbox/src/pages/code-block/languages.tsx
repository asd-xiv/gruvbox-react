import { CodeBlock } from "@asd14/gruvbox-react/ui"

const CodeBlockLanguages = () => (
  <div className="grid gap-2">
    <CodeBlock title="save.tsx">
      {`<Button onClick={save}>Save</Button>`}
    </CodeBlock>
    <CodeBlock language="css" title="save.module.css">
      {".save {\n  margin-left: auto;\n}"}
    </CodeBlock>
    <CodeBlock language="sh">npm install @asd14/gruvbox-react</CodeBlock>
  </div>
)

export { CodeBlockLanguages }
