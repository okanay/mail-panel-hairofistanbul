import { Column } from '@react-email/components'

export const RenderColumn = ({ block, Renderer }: { block: ColumnBlock; Renderer: any }) => (
  <Column valign="top" {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Column>
)
