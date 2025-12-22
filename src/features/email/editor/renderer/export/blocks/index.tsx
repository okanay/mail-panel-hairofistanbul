import { RenderImage } from './image'
import { RenderButton } from './button'
import { RenderText } from './text'
import { RenderColumn } from './column'
import { RenderRow } from './row'
import { RenderSection } from './section'

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
