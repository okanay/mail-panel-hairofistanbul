import {
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { RecursiveRenderer } from '..'

export const BlockContainer = ({ block }: { block: ContainerBlock }) => {
  const isRow = block.styles?.flexDirection === 'row'
  const strategy = isRow ? horizontalListSortingStrategy : verticalListSortingStrategy

  return (
    <SortableContext id={block.id} items={block.children.map((c) => c.id)} strategy={strategy}>
      {block.children.length === 0 ? (
        <EmptyState />
      ) : (
        block.children.map((child) => <RecursiveRenderer key={child.id} block={child} />)
      )}
    </SortableContext>
  )
}

const EmptyState = () => (
  <div className="flex size-full flex-1 flex-col">
    <div className="h-full w-full rounded border border-dashed border-stone-200 bg-stone-100 p-4" />
  </div>
)
