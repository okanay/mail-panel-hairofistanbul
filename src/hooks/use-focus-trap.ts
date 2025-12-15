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

      // Modal içindeki elementler
      const modalElements = Array.from(container.querySelectorAll<HTMLElement>(selector))

      // Body'deki açık dropdown elementleri
      const dropdownElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-dropdown-layer] ' + selector),
      )

      // İkisini birleştir ve görünür olanları filtrele
      return [...modalElements, ...dropdownElements].filter((el) => {
        return el.offsetParent !== null
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC tuşu
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }

      // Tab tuşu değilse devam et
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

      // Shift + Tab
      if (e.shiftKey) {
        if (currentIndex === 0) {
          e.preventDefault()
          lastElement.focus()
        }
      }
      // Tab
      else {
        if (currentIndex === focusableElements.length - 1) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    // İlk focusable elemente focus
    const focusableElements = getFocusableElements()
    focusableElements[0]?.focus()

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [active, onEscape])

  return containerRef
}
