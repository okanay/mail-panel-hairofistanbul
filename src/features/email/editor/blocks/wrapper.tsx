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

  // Parent'ın flex yönüne göre okları belirle
  const isMyParentRoot = parent?.id === 'root'
  const parentStyle = parent?.styles || {}

  const isRow = !isMyParentRoot
    ? parentStyle.display === 'flex' && parentStyle.flexDirection === 'row'
    : block.styles?.flexDirection === 'row'

  const MoveBackIcon = isRow ? ArrowLeft : ArrowUp
  const MoveForwardIcon = isRow ? ArrowRight : ArrowDown

  // Handlers
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

  // Root için basit render
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

  // DnD stilleri - block.styles'dan ayrı tut
  const dndStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  }

  // Drag durumuna göre görsel stiller
  const dragStateClasses = twMerge(
    'group/wrapper relative',
    // Normal durum
    !isDragging && !isSelected && 'hover:ring-1 hover:ring-blue-300',
    // Seçili durum
    !isDragging && isSelected && 'z-10 ring-2 ring-blue-500',
    // Dragging durumu - placeholder olarak göster
    isDragging && 'opacity-40 ring-2 ring-dashed ring-blue-400',
  )

  return (
    <div
      ref={setNodeRef}
      style={{ ...block.styles, ...dndStyle }}
      onClick={handleSelect}
      className={dragStateClasses}
      // Drag sırasında pointer events kapat
      data-dragging={isDragging || undefined}
    >
      {/* TOOLBAR */}
      {isSelected && !isDragging && (
        <div className="absolute -top-7 right-0 z-50 flex items-center gap-1 rounded bg-blue-500 p-1 shadow-xl">
          <div className="px-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {block.type}
          </div>
          <div className="mx-1 h-3 w-px bg-blue-400" />
          <button
            onMouseDown={handleMoveBack}
            className="rounded p-0.5 text-white hover:bg-blue-600"
            title="Move back"
          >
            <MoveBackIcon size={14} />
          </button>
          <button
            onMouseDown={handleMoveForward}
            className="rounded p-0.5 text-white hover:bg-blue-600"
            title="Move forward"
          >
            <MoveForwardIcon size={14} />
          </button>
          <div className="mx-1 h-3 w-px bg-blue-400" />
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
