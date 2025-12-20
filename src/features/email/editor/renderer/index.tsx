import { BlockButton } from './button'
import { BlockContainer } from './container'
import { BlockImage } from './image'
import { BlockRootContainer } from './root'
import { BlockText } from './text'
import { BlockWrapper } from './wrapper'

export const RecursiveRenderer = ({ block }: { block: EmailBlock }) => {
  let isRoot = block.id === 'root'
  let Component = null

  switch (block.type) {
    case 'text':
      Component = <BlockText block={block as TextBlock} />
      break
    case 'button':
      Component = <BlockButton block={block as ButtonBlock} />
      break
    case 'image':
      Component = <BlockImage block={block as ImageBlock} />
      break
    case 'container':
      Component = <BlockContainer block={block as ContainerBlock} />
      break
    default:
      return null
  }

  if (isRoot) {
    return <BlockRootContainer block={block as ContainerBlock} />
  }

  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}
