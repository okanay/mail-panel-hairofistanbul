import { useEffect, useRef } from 'react'

interface Options {
  active: boolean
  onEscape?: () => void
}

export function useFocusTrap({ active, onEscape }: Options) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const previousActiveElement = document.activeElement as HTMLElement

    // Focusable elementleri bul
    const getFocusableElements = () => {
      const selector = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])',
      ].join(',')

      return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((el) => {
        return el.offsetParent !== null
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }

      if (e.key !== 'Tab') return

      const activeElement = document.activeElement as HTMLElement
      if (activeElement?.closest('[data-dropdown-layer]')) {
        return
      }

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [active, onEscape])

  return containerRef
}
