import { DndProvider } from '../../providers/dnd-provider'
import { useEmailStore } from '../../store'
import { RecursiveRenderer } from '../renderer'

export const Canvas = () => {
  const { blocks, reorderBlock } = useEmailStore()

  const rootBlock = blocks.find((b) => b.id === 'root')

  // DragEnd handler - store'a delege et
  const handleDragEnd = (activeId: string, overId: string) => {
    reorderBlock(activeId, overId)
  }

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-primary-50 py-8">
      <DndProvider onDragEnd={handleDragEnd} renderOverlay={() => null}>
        <div className="min-h-150 w-150 rounded-lg bg-white shadow-xl">
          {rootBlock && <RecursiveRenderer block={rootBlock} />}
        </div>
      </DndProvider>
    </div>
  )
}
