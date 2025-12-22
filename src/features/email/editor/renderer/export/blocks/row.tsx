import { Row } from '@react-email/components'

export const RenderRow = ({ block, Renderer }: { block: RowBlock; Renderer: any }) => (
  <Row style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((col) => (
      <Renderer key={col.id} block={col} />
    ))}
  </Row>
)
