import { BlockWrapper } from './wrapper'
import { Section, Row, Column, Text, Button, Img } from '@react-email/components'

// ------------------------------------------------------------------
// SIMPLE RENDERERS (Leafs)
// ------------------------------------------------------------------
const RenderText = ({ block }: { block: TextBlock }) => (
  <Text {...block.props}>{block.content}</Text>
)
const RenderButton = ({ block }: { block: ButtonBlock }) => (
  <Button {...block.props}>{block.content}</Button>
)
const RenderImage = ({ block }: { block: ImageBlock }) => (
  <Img {...block.props} style={{ maxWidth: '100%', ...block.props?.style }} />
)

// ------------------------------------------------------------------
// STRUCTURAL RENDERERS (Recursive)
// ------------------------------------------------------------------

// SECTION (Tek Sütun - %100 Genişlik)
const RenderSection = ({ block, Renderer }: { block: SectionBlock; Renderer: any }) => (
  <Section style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Section>
)

// ROW (Çoklu Sütun - Grid)
const RenderRow = ({ block, Renderer }: { block: RowBlock; Renderer: any }) => (
  <Row style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((col) => (
      <Renderer key={col.id} block={col} />
    ))}
  </Row>
)

// COLUMN (Hücre)
const RenderColumn = ({ block, Renderer }: { block: ColumnBlock; Renderer: any }) => (
  <Column style={{ ...block.props?.style }} {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Column>
)

// ------------------------------------------------------------------
// MAIN DISPATCHERS
// ------------------------------------------------------------------

export const EditorComponentRenderer = ({ block }: { block: EmailBlock }) => {
  let Component = null

  switch (block.type) {
    case 'section':
      Component = <RenderSection block={block as SectionBlock} Renderer={EditorComponentRenderer} />
      break
    case 'row':
      Component = <RenderRow block={block as RowBlock} Renderer={EditorComponentRenderer} />
      break
    case 'column':
      Component = <RenderColumn block={block as ColumnBlock} Renderer={EditorComponentRenderer} />
      break
    case 'text':
      Component = <RenderText block={block as TextBlock} />
      break
    case 'button':
      Component = <RenderButton block={block as ButtonBlock} />
      break
    case 'image':
      Component = <RenderImage block={block as ImageBlock} />
      break
    default:
      return null
  }

  // Wrapper her bloğu sarmalar (Drag & Drop ve Seçim için)
  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}

export const ExportComponentRenderer = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'section':
      return <RenderSection block={block as SectionBlock} Renderer={ExportComponentRenderer} />
    case 'row':
      return <RenderRow block={block as RowBlock} Renderer={ExportComponentRenderer} />
    case 'column':
      return <RenderColumn block={block as ColumnBlock} Renderer={ExportComponentRenderer} />
    case 'text':
      return <RenderText block={block as TextBlock} />
    case 'button':
      return <RenderButton block={block as ButtonBlock} />
    case 'image':
      return <RenderImage block={block as ImageBlock} />
    default:
      return null
  }
}
