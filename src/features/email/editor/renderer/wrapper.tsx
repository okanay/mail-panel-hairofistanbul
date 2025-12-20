import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Grip, Trash2 } from 'lucide-react'
import type { CSSProperties, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEmailStore } from '../../store'

interface BlockWrapperProps extends PropsWithChildren {
  block: EmailBlock
}

export const BlockWrapper = ({ block, children }: BlockWrapperProps) => {
  const { selected, setSelected, removeBlock, moveBlockStep, getParent } = useEmailStore()

  const isSelected = selected === block.id
  const isRoot = block.id === 'root'
  const parent = getParent(block.id)

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: isRoot,
    data: {
      type: block.type,
      block,
      parentId: parent?.id ?? null,
    },
  })

  // Root için özel render
  if (isRoot) {
    return (
      <div
        style={block.styles}
        className="relative h-full w-full bg-white outline-none"
        onClick={() => setSelected('root')}
      >
        {children}
      </div>
    )
  }

  // Parent flex yönüne göre hareket ikonları
  const isParentRow =
    parent?.id === 'root'
      ? block.styles?.flexDirection === 'row'
      : parent?.styles?.display === 'flex' && parent?.styles?.flexDirection === 'row'

  const MoveBackIcon = isParentRow ? ArrowLeft : ArrowUp
  const MoveForwardIcon = isParentRow ? ArrowRight : ArrowDown

  // Event handlers
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(block.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeBlock(block.id)
  }

  const handleMoveBack = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveBlockStep(block.id, 'before')
  }

  const handleMoveForward = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveBlockStep(block.id, 'after')
  }

  // Drag & Drop stilleri
  const dndStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  }

  const wrapperClasses = twMerge(
    'group/wrapper relative',
    !isDragging && !isSelected && 'hover:ring-1 hover:ring-blue-300',
    !isDragging && isSelected && 'z-10 ring-2 ring-blue-500',
    isDragging && 'opacity-40 ring-2 ring-dashed ring-blue-400',
  )

  return (
    <div
      ref={setNodeRef}
      style={{ ...block.styles, ...dndStyle }}
      onClick={handleSelect}
      className={wrapperClasses}
      data-dragging={isDragging || undefined}
    >
      {/* Toolbar */}
      {isSelected && !isDragging && (
        <div className="absolute -top-7 right-0 z-50 flex items-center gap-1 rounded bg-blue-500 p-1 shadow-xl">
          {/* Block Type Label */}
          <div className="px-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {block.type}
          </div>

          <div className="mx-1 h-3 w-px bg-blue-400" />

          {/* Move Buttons */}
          <button
            hidden
            onMouseDown={handleMoveBack}
            className="rounded p-0.5 text-white hover:bg-blue-600"
            title="Move back"
          >
            <MoveBackIcon size={14} />
          </button>
          <button
            hidden
            onMouseDown={handleMoveForward}
            className="rounded p-0.5 text-white hover:bg-blue-600"
            title="Move forward"
          >
            <MoveForwardIcon size={14} />
          </button>

          <div hidden className="mx-1 h-3 w-px bg-blue-400" />

          {/* Delete Button */}
          <button
            onMouseDown={handleDelete}
            className="rounded p-0.5 text-white hover:bg-red-500"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

          {/* Drag Handle */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-0.5 text-white hover:bg-blue-600 active:cursor-grabbing"
            title="Drag to reorder"
          >
            <Grip size={14} />
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
