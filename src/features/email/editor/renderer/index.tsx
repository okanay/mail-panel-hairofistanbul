import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { BlockWrapper } from './blocks/wrapper'

// ============================================
// DUMB COMPONENTS
// ============================================

const TextComponent = ({ block }: { block: TextBlock }) => (
  <p contentEditable style={{ ...block.styles }}>
    {block.content}
  </p>
)

const ButtonComponent = ({ block }: { block: ButtonBlock }) => (
  <a style={{ ...block.styles }} href={block.props.url}>
    {block.content}
  </a>
)

const ImageComponent = ({ block }: { block: ImageBlock }) => (
  <img style={{ ...block.styles }} src={block.props.src} alt={block.props.alt} draggable={false} />
)

// ============================================
// CONTAINER COMPONENT
// ============================================

const ContainerComponent = ({ block }: { block: ContainerBlock }) => {
  const isRow = block.styles?.flexDirection === 'row'

  return (
    <SortableContext
      id={block.id}
      items={block.children.map((c) => c.id)}
      strategy={isRow ? horizontalListSortingStrategy : verticalListSortingStrategy}
    >
      {block.children.length === 0 ? (
        <div className="flex size-full flex-1 flex-col">
          <div className="h-full w-full rounded border border-dashed border-stone-200 bg-stone-100 p-4" />
        </div>
      ) : (
        block.children.map((child) => <RecursiveRenderer key={child.id} block={child} />)
      )}
    </SortableContext>
  )
}

// ============================================
// RECURSIVE RENDERER
// ============================================

export const RecursiveRenderer = ({ block }: { block: EmailBlock }) => {
  let Component = null

  switch (block.type) {
    case 'text':
      Component = <TextComponent block={block as TextBlock} />
      break
    case 'button':
      Component = <ButtonComponent block={block as ButtonBlock} />
      break
    case 'image':
      Component = <ImageComponent block={block as ImageBlock} />
      break
    case 'container':
      Component = <ContainerComponent block={block as ContainerBlock} />
      break
    default:
      return null
  }

  return <BlockWrapper block={block}>{Component}</BlockWrapper>
}
