import { SafePortal } from '@/components/safe-portal'
import { useEmailStore } from '@/features/email/store'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { cloneElement, useEffect, useEffectEvent, useRef, type ReactElement } from 'react'

interface BlockWrapperProps {
  block: EmailBlock
  children: ReactElement<any, any>
}

export const BlockWrapper = ({ block, children }: BlockWrapperProps) => {
  const { setSelection } = useEmailStore()
  const elementRef = useRef<HTMLElement>(null)

  // Koordinat Hesaplayıcı
  const updateRect = () => {
    const el = elementRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setSelection(block.id, {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      })
    }
  }

  // Click Handler
  const handleClick = useEffectEvent((e: Event) => {
    e.stopPropagation()
    updateRect()
  })

  // Listener Ekleme / Çıkarma
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('click', handleClick)

    return () => {
      element.removeEventListener('click', handleClick)
    }
  }, [])

  return cloneElement(children, {
    ref: elementRef,
  })
}

export const FloatingToolbar = () => {
  const { selected, activeRect, removeBlock, moveBlockStep, getBlock } = useEmailStore()

  if (!selected || !activeRect) return null
  const selectedBlock = getBlock(selected)

  if (!selectedBlock || selectedBlock.id === 'root') return null

  return (
    <SafePortal>
      <div
        className="animate-in fade-in zoom-in-95 flex h-8 items-center gap-0.5 rounded-md border border-stone-200 bg-white p-1 shadow-lg ring-1 ring-black/5 duration-100"
        style={{
          position: 'absolute',
          top: activeRect.top - 36,
          left: activeRect.left + activeRect.width - 24,
          zIndex: 9999,
          transform: 'translateX(-100%)',
        }}
      >
        {/* Blok Tipi Etiketi */}
        <div className="mr-2 border-r border-stone-200 px-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase select-none">
          {selectedBlock.type}
        </div>
        {/* Aksiyonlar */}
        <button
          onClick={() => moveBlockStep(selected, 'before')}
          className="rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          title="Yukarı"
        >
          <ArrowUp size={14} />
        </button>
        <button
          onClick={() => moveBlockStep(selected, 'after')}
          className="rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          title="Aşağı"
        >
          <ArrowDown size={14} />
        </button>
        <div className="mx-1 h-3 w-px bg-stone-200" />
        <button
          onClick={() => removeBlock(selected)}
          className="rounded p-1 text-stone-500 hover:bg-red-50 hover:text-red-600"
          title="Sil"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </SafePortal>
  )
}
