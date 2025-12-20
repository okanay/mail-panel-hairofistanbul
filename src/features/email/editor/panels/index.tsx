import { useEmailStore } from '../../store'
import { ButtonProperties } from './button'
import { ContainerProperties } from './container'
import { ImageProperties } from './image'
import { RootProperties } from './root'
import { TextProperties } from './text'

export const PropertiesPanel = () => {
  const { selected, getBlock } = useEmailStore()

  const selectedBlock = selected ? getBlock(selected) : null
  const isRoot = selectedBlock?.id === 'root'

  let PropertiesComponent = null

  if (!selectedBlock || isRoot) {
    PropertiesComponent = <RootProperties />
  } else {
    switch (selectedBlock.type) {
      case 'container':
        PropertiesComponent = <ContainerProperties block={selectedBlock as ContainerBlock} />
        break
      case 'text':
        PropertiesComponent = <TextProperties block={selectedBlock as TextBlock} />
        break
      case 'button':
        PropertiesComponent = <ButtonProperties block={selectedBlock as ButtonBlock} />
        break
      case 'image':
        PropertiesComponent = <ImageProperties block={selectedBlock as ImageBlock} />
        break
    }
  }

  return <aside className="w-64 border-l border-stone-200 bg-white">{PropertiesComponent}</aside>
}
