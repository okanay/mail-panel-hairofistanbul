import { Row } from '@react-email/components'
import { Ref } from 'react'

export const RenderRow = ({
  block,
  ref,
  Renderer,
}: {
  block: RowBlock
  ref?: Ref<any>
  Renderer: any
}) => (
  <Row ref={ref} style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((col) => (
      <Renderer key={col.id} block={col} />
    ))}
  </Row>
)
