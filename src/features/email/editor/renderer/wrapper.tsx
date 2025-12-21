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

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  // --- ACTIONS ---

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
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

  // --- RENDER ---

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      className={twMerge(
        'group relative isolate z-20 min-h-4 w-full transition-all duration-200 ease-in-out',
        !isSelected && !isDragging && 'hover:z-10 hover:ring-1 hover:ring-blue-400',
        isSelected && 'z-20 ring-2 ring-blue-600',
        isDragging && 'ring-dashed z-0 opacity-50 ring-2 ring-stone-400',
      )}
    >
      {/* --- TOOLBAR (Sadece Seçiliyken Görünür) --- */}
      {isSelected && !isDragging && (
        <div className="absolute -top-7 right-0 z-50 flex h-7 items-center overflow-hidden rounded-t bg-blue-600 text-white shadow-sm">
          <div className="border-r border-blue-500/50 px-2 text-[10px] font-bold tracking-wider uppercase">
            {block.type}
          </div>

          {/* Yukarı Taşı */}
          <button
            onClick={handleMoveUp}
            className="h-full px-1.5 transition-colors hover:bg-blue-700"
            title="Yukarı Taşı"
          >
            <ArrowUp size={12} />
          </button>

          {/* Aşağı Taşı */}
          <button
            onClick={handleMoveDown}
            className="h-full px-1.5 transition-colors hover:bg-blue-700"
            title="Aşağı Taşı"
          >
            <ArrowDown size={12} />
          </button>

          {/* Sürükle (Drag Handle) */}
          <button
            ref={setActivatorNodeRef}
            {...listeners} // Sürükleme eventlerini sadece bu butona veriyoruz
            {...attributes}
            className="h-full cursor-grab border-l border-blue-500/50 px-1.5 hover:bg-blue-700 active:cursor-grabbing"
            title="Sürükle"
          >
            <GripVertical size={12} />
          </button>

          {/* Sil */}
          <button
            onClick={handleDelete}
            className="h-full border-l border-blue-500/50 px-2 transition-colors hover:bg-red-500"
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
