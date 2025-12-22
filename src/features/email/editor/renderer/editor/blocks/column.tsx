import { Column } from '@react-email/components'
import { Ref } from 'react'

export const RenderColumn = ({
  block,
  ref,
  Renderer,
}: {
  block: ColumnBlock
  ref?: Ref<any>
  Renderer: any
}) => (
  <Column ref={ref} valign="top" style={{ ...block.props?.style }} {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Column>
)
