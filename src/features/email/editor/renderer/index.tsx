import { BlockButton } from './button'
import { EditorBlockContainer, ExportBlockContainer } from './container'
import { BlockImage } from './image'
import { BlockText } from './text'
import { BlockWrapper } from './wrapper'

export const EditorComponentRenderer = ({ block }: { block: EmailBlock }) => {
  let Component = null

  switch (block.type) {
    case 'container':
      Component = <EditorBlockContainer block={block as ContainerBlock} />
      break
    case 'text':
      Component = <BlockText block={block as TextBlock} />
      break
    case 'button':
      Component = <BlockButton block={block as ButtonBlock} />
      break
    case 'image':
      Component = <BlockImage block={block as ImageBlock} />
      break
    default:
      return <div className="p-2 text-xs text-red-500">Bilinmeyen Tip {block.type}</div>
  }

  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}

export const ExportComponentRenderer = ({ block }: { block: EmailBlock }) => {
  let Component = null

  switch (block.type) {
    case 'container':
      Component = <ExportBlockContainer block={block as ContainerBlock} />
      break
    case 'text':
      Component = <BlockText block={block as TextBlock} />
      break
    case 'button':
      Component = <BlockButton block={block as ButtonBlock} />
      break
    case 'image':
      Component = <BlockImage block={block as ImageBlock} />
      break
    default:
      return <div className="p-2 text-xs text-red-500">Bilinmeyen Tip {block.type}</div>
  }

  return Component
}
