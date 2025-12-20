import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Grip } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { EditorBlockRenderer } from '..'
import { useEmailStore } from '../../store'

export const EditableContainerBlock = ({
  block,
  depth = 0,
}: {
  block: ContainerBlock
  depth?: number
}) => {
  const { selected, setSelected, isDescendant } = useEmailStore()
  const isSelected = selected.includes(block.id)

  const {
    setNodeRef: setDroppableRef,
    isOver,
    active,
  } = useDroppable({
    id: block.id,
    data: {
      type: 'container',
      accepts: ['container', 'text', 'image', 'button'],
      block,
    },
  })

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: block.id,
    data: {
      type: 'container',
      block,
    },
  })

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  // ============ DROP VALIDATION ============

  const isSelf = active?.id === block.id

  const isDropTargetInsideActive = (() => {
    if (!active) return false
    const activeId = active.id as string
    if (activeId === block.id) return false

    return isDescendant(activeId, block.id)
  })()

  // Drop durumları
  const isValidDrop = isOver && !isSelf && !isDropTargetInsideActive
  const isInvalidDrop = isOver && !isSelf && isDropTargetInsideActive

  // Kendisi veya çocukları drag ediliyorsa indicator gösterme
  const showValidDropIndicator = isValidDrop && !isDragging
  const showInvalidDropIndicator = isInvalidDrop && !isDragging

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (e.shiftKey) {
      if (isSelected) {
        setSelected(selected.filter((id) => id !== block.id))
      } else {
        setSelected([...selected, block.id])
      }
    } else {
      setSelected([block.id])
    }
  }

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={setDroppableRef}
      id={block.id}
      style={{
        ...dragStyle,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: '50px',
        padding: '8px',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
        ...block.styles,
      }}
      className={twMerge(
        'group/container border transition-colors duration-200',
        showValidDropIndicator && 'border-green-500 bg-green-50/20 ring-2 ring-green-500',
        showInvalidDropIndicator && 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500',
        isSelected && !showValidDropIndicator && !showInvalidDropIndicator
          ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
          : !showValidDropIndicator &&
              !showInvalidDropIndicator &&
              'border-transparent hover:border-blue-300',
        isDragging && 'ring-2 ring-blue-500 ring-offset-2',
      )}
      onClick={handleClick}
    >
      {/* Container Info & Drag Handle */}
      {isSelected && (
        <div className="absolute -top-6 left-0 z-20 flex items-center gap-1">
          <div className="flex h-5 items-center rounded-sm bg-blue-500 px-1.5 text-[10px] text-white">
            Container {depth > 0 && `(L${depth})`}
          </div>

          <button
            ref={setDraggableRef}
            {...attributes}
            {...listeners}
            type="button"
            className={twMerge(
              'flex h-5 w-5 items-center justify-center rounded-sm',
              'bg-stone-800 text-white hover:bg-stone-600',
              'cursor-grab active:cursor-grabbing',
              'touch-none',
            )}
            onClick={handleDragHandleClick}
          >
            <Grip className="size-3 text-stone-50" />
          </button>
        </div>
      )}

      {block.children.length === 0 && (
        <div
          className={twMerge(
            'pointer-events-none flex flex-col items-center justify-center gap-1 rounded',
            'border border-dashed border-gray-300 bg-gray-50/50 p-4',
            'text-xs text-gray-400',
            // Valid drop
            showValidDropIndicator && 'border-green-400 bg-green-50 text-green-600',
          )}
        >
          {showValidDropIndicator ? 'Buraya Bırak!' : 'İçerik Sürükleyin'}
        </div>
      )}

      {/* Children */}
      {block.children.map((child) => (
        <EditorBlockRenderer key={child.id} block={child} depth={depth + 1} />
      ))}
    </div>
  )
}
