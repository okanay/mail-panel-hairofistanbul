import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RecursiveRenderer } from '..'

export const BlockRootContainer = ({ block }: { block: ContainerBlock }) => {
  return (
    <SortableContext
      id={block.id}
      items={block.children.map((c) => c.id)}
      strategy={verticalListSortingStrategy}
    >
      {block.children.length === 0 ? (
        <EmptyState />
      ) : (
        block.children.map((child) => <RecursiveRenderer key={child.id} block={child} />)
      )}
    </SortableContext>
  )
}

const EmptyState = () => (
  <div className="flex size-full flex-1 flex-col p-4">
    <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-stone-200 bg-stone-100 text-center text-xs text-stone-500 underline">
      Add Your First Element
    </div>
  </div>
)
