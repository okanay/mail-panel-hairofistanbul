import { BlockButton } from './button'
import { BlockContainer } from './container'
import { BlockImage } from './image'
import { BlockText } from './text'
import { BlockWrapper } from './wrapper'

export const RecursiveRenderer = ({ block }: { block: EmailBlock }) => {
  let Component = null

  // 2. Component Eşleştirme
  switch (block.type) {
    case 'container':
      Component = <BlockContainer block={block as ContainerBlock} />
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
