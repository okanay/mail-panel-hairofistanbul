import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropdownStore } from './store'
import { twMerge } from 'tailwind-merge'

// ============================================================================
// TYPES
// ============================================================================

interface DropdownRenderProps {
  triggerRef: (element: HTMLElement | null) => void
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

interface DropdownRenderContentProps {
  triggerWidth: number
}

interface DropdownWrapperProps {
  render: (props: DropdownRenderProps) => React.ReactNode
  children: React.ReactNode | ((props: DropdownRenderContentProps) => React.ReactNode)
  className?: string
  dropdownClassName?: string
}

const DropdownParentContext = createContext<string | null>(null)

export function DropdownWrapper({
  render,
  children,
  className,
  dropdownClassName,
}: DropdownWrapperProps) {
  const store = useDropdownStore()
  const parentId = useContext(DropdownParentContext)
  const triggerRef = useRef<HTMLElement>(null)
  const [dropdownId] = useState(
    () => `dropdown_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  )

  const isOpen = store.isOpen(dropdownId)
  const dropdown = store.stack.find((d) => d.id === dropdownId)

  // Ref callback - otomatik data-dropdown-trigger ekler
  const setTriggerRef = (element: HTMLElement | null) => {
    if (element) {
      element.dataset.dropdownTrigger = dropdownId
    }
    ;(triggerRef as any).current = element
  }

  const open = () => {
    if (!isOpen) store.open(dropdownId, parentId)
  }

  const close = () => {
    if (isOpen) {
      const level = store.getLevel(dropdownId)
      store.closeFromLevel(level)
    }
  }

  const toggle = () => (isOpen ? close() : open())

  // Cleanup
  useEffect(() => {
    return () => {
      if (isOpen) store.close(dropdownId)
    }
  }, [])

  return (
    <DropdownParentContext.Provider value={dropdownId}>
      {render({
        triggerRef: setTriggerRef,
        isOpen,
        toggle,
        open,
        close,
      })}
      {isOpen &&
        createPortal(
          <DropdownPortal
            dropdownId={dropdownId}
            triggerElement={triggerRef.current}
            zIndex={dropdown?.zIndex ?? 2000}
            className={twMerge(className, dropdownClassName)}
          >
            {children}
          </DropdownPortal>,
          document.body,
        )}
    </DropdownParentContext.Provider>
  )
}

interface DropdownPortalProps {
  dropdownId: string
  triggerElement: HTMLElement | null
  zIndex: number
  className?: string
  children: React.ReactNode | ((props: DropdownRenderContentProps) => React.ReactNode)
}

function DropdownPortal({
  dropdownId,
  triggerElement,
  zIndex,
  className,
  children,
}: DropdownPortalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [triggerWidth, setTriggerWidth] = useState(0)
  const [isPositioned, setIsPositioned] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerElement || !contentRef.current) return

    const updatePosition = () => {
      const triggerRect = triggerElement.getBoundingClientRect()
      const contentRect = contentRef.current!.getBoundingClientRect()

      setTriggerWidth(triggerRect.width)

      let top = triggerRect.bottom + window.scrollY + 4
      let left = triggerRect.left + window.scrollX

      // Viewport kontrolü - sağ taşma
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 8
      }

      // Viewport kontrolü - alt taşma
      if (top + contentRect.height > window.innerHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - contentRect.height - 4
      }

      setPosition({ top, left })
      setIsPositioned(true)
    }

    updatePosition()

    const resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(triggerElement)
    resizeObserver.observe(contentRef.current)

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [triggerElement])

  return (
    <div
      ref={contentRef}
      data-dropdown-layer
      data-dropdown-id={dropdownId}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex,
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 150ms ease-out',
      }}
      className={className}
    >
      {typeof children === 'function' ? children({ triggerWidth }) : children}
    </div>
  )
}
