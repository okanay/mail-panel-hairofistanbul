import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react'
import type { MouseEvent, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEmailStore } from '../../store'

interface BlockWrapperProps extends PropsWithChildren {
  block: EmailBlock
}

export const BlockWrapper = ({ block, children }: BlockWrapperProps) => {
  const { selected, setSelected, removeBlock, moveBlockStep } = useEmailStore()

  const isSelected = selected === block.id

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
    data: {
      type: block.type,
      block,
    },
  })

  const dndStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  // --- ACTIONS ---

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation()
    setSelected(block.id)
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    removeBlock(block.id)
  }

  const handleMoveUp = (e: MouseEvent) => {
    e.stopPropagation()
    moveBlockStep(block.id, 'before')
  }

  const handleMoveDown = (e: MouseEvent) => {
    e.stopPropagation()
    moveBlockStep(block.id, 'after')
  }

  // --- DISPLAY LOGIC (Kritik Kısım) ---
  const isInline = ['button'].includes(block.type)

  return (
    <div
      ref={setNodeRef}
      onClick={handleSelect}
      style={{
        ...dndStyle,
        display: isInline ? 'inline-block' : 'block',
        width: isInline ? 'max-content' : '100%',
        verticalAlign: 'top',
        boxSizing: 'border-box',
        position: 'relative',
      }}
      className={twMerge(
        'group isolate transition-all duration-200 ease-in-out',
        // --- GÖRSEL EFEKTLER ---
        !isSelected && !isDragging && 'hover:z-10 hover:ring-1 hover:ring-blue-400',
        isSelected && 'z-20 ring-2 ring-blue-600',
        isDragging && 'z-0 opacity-50',
      )}
    >
      {/* --- TOOLBAR --- */}
      {isSelected && !isDragging && (
        <div className="absolute -top-7 right-0 z-50 flex h-7 items-center overflow-hidden rounded-t bg-blue-600 text-white shadow-sm ring-0">
          {/* Tip Etiketi */}
          <div className="flex h-full items-center border-r border-blue-500/50 px-2 text-[10px] font-bold tracking-wider uppercase select-none">
            {block.type}
          </div>

          {/* Yukarı Taşı */}
          <button onClick={handleMoveUp} className="h-full px-1.5 hover:bg-blue-700" title="Yukarı">
            <ArrowUp size={12} />
          </button>

          {/* Aşağı Taşı */}
          <button
            onClick={handleMoveDown}
            className="h-full px-1.5 hover:bg-blue-700"
            title="Aşağı"
          >
            <ArrowDown size={12} />
          </button>

          {/* Sürükle Tutacağı */}
          <button
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="h-full cursor-grab border-l border-blue-500/50 px-1.5 hover:bg-blue-700 active:cursor-grabbing"
            title="Sürükle"
          >
            <GripVertical size={12} />
          </button>

          {/* Sil */}
          <button
            onClick={handleDelete}
            className="h-full border-l border-blue-500/50 px-2 hover:bg-red-500"
            title="Sil"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
