import { BlockButton } from './blocks/button'
import { BlockContainer } from './blocks/container'
import { BlockImage } from './blocks/image'
import { BlockRootContainer } from './blocks/root'
import { BlockText } from './blocks/text'
import { BlockWrapper } from './blocks/wrapper'

export const RecursiveRenderer = ({ block }: { block: EmailBlock }) => {
  let isRoot = block.id === 'root'
  let Component = null

  if (isRoot) {
    Component = <BlockRootContainer block={block as ContainerBlock} />
  } else {
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
  }

  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}
