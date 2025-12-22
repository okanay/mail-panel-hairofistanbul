import { BlockWrapper } from './components/wrapper'
import { RenderImage } from './image'
import { RenderButton } from './button'
import { RenderText } from './text'
import { RenderColumn } from './column'
import { RenderRow } from './row'
import { RenderSection } from './section'

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

  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}
