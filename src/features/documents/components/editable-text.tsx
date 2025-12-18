import { SafePortal } from '@/components/safe-portal'
import { useDocumentStore } from '@/features/documents/store'
import { ClientOnly, useSearch } from '@tanstack/react-router'
import { Command } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface EditableTextProps {
  field: FormModeTextInputConfig
  className?: string
  focusClassName?: string
}

const InnerComponent = ({ field, className, focusClassName }: EditableTextProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const contentRef = useRef<HTMLSpanElement>(null)

  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'

  const { edits, setEdit } = useDocumentStore()
  const savedValue = edits[field.editKey] as string | undefined

  const isSeedMode = field.seedValue && field.seedValue !== field.defaultValue
  const initialHTML = field.seedValue || field.defaultValue
  const currentHTML = savedValue !== undefined ? savedValue : initialHTML

  const getTextContent = (html: string): string => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent?.trim() || ''
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (!contentRef.current) return

    const rawHTML = contentRef.current.innerHTML.trim()
    const textContent = contentRef.current.textContent?.trim() || ''

    if (rawHTML !== currentHTML) {
      setEdit(field.editKey, rawHTML)
    }

    if (!textContent && contentRef.current.innerHTML !== '') {
      contentRef.current.innerHTML = ''
      setEdit(field.editKey, '')
    }
  }

  const saveAndBlur = () => {
    if (contentRef.current) {
      contentRef.current.blur()
    }
  }

  const toggleStyle = (className: string, styleName: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (range.collapsed) return

    const container = range.commonAncestorContainer
    const parentElement =
      container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as HTMLElement)

    const existingSpan = parentElement?.closest(`span[data-style="${styleName}"]`) as HTMLElement

    if (existingSpan && contentRef.current?.contains(existingSpan)) {
      const parent = existingSpan.parentNode
      if (!parent) return

      const fragment = document.createDocumentFragment()
      while (existingSpan.firstChild) {
        fragment.appendChild(existingSpan.firstChild)
      }
      parent.replaceChild(fragment, existingSpan)
    } else {
      const span = document.createElement('span')
      span.className = className
      span.setAttribute('data-style', styleName)

      try {
        range.surroundContents(span)
      } catch (error) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    }

    selection.removeAllRanges()

    if (contentRef.current) {
      setEdit(field.editKey, contentRef.current.innerHTML)
    }
  }

  const getStatusStyles = () => {
    if (!editable) return ''

    if (isFocused) {
      return twMerge(
        'border border-black border-dashed bg-black/70 text-white px-2 py-1 outline-none min-w-10 z-20 relative',
        focusClassName,
      )
    }

    if (isEditedAndFilled) {
      return 'border border-dashed border-neutral-300 bg-neutral-200 px-2 py-0'
    }

    return 'border border-dashed border-orange-400 bg-orange-100 px-2 py-0 min-w-10'
  }

  useEffect(() => {
    if (savedValue === undefined && field.seedValue) {
      setEdit(field.editKey, field.seedValue)
    }
  }, [isSeedMode, savedValue, field.seedValue, field.editKey, setEdit])

  useEffect(() => {
    if (!contentRef.current || isFocused) return

    if (contentRef.current.innerHTML !== currentHTML) {
      contentRef.current.innerHTML = currentHTML
    }
  }, [currentHTML, isFocused])

  useEffect(() => {
    if (!contentRef.current || !editable) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const hasShift = e.shiftKey
      const isModifier = e.metaKey || e.ctrlKey

      if (key === 'enter') {
        e.preventDefault()
        saveAndBlur()
        return
      }

      if (!isModifier) return

      switch (key) {
        case 'b':
          if (!hasShift) {
            e.preventDefault()
            toggleStyle('font-bold', 'bold')
          }
          break

        case 'i':
          if (!hasShift) {
            e.preventDefault()
            toggleStyle('italic', 'italic')
          }
          break

        case 'u':
          if (!hasShift) {
            e.preventDefault()
            toggleStyle('underline', 'underline')
          }
          break

        case 'p':
          if (hasShift) {
            e.preventDefault()
            toggleStyle('text-primary decoration-primary', 'brand-color')
          }
          break
      }
    }

    const element = contentRef.current
    element.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [editable])

  const currentTextContent = getTextContent(currentHTML)
  const hasUserEdit = savedValue !== undefined && currentTextContent.length > 0
  const hasSeedContent = isSeedMode && currentTextContent.length > 0
  const isEditedAndFilled = hasUserEdit || hasSeedContent

  return (
    <>
      <span
        ref={contentRef}
        contentEditable={editable}
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={twMerge(
          'isolate caret-black transition-[padding] duration-250 ease-in-out focus:ring-0',
          editable && 'cursor-pointer',
          getStatusStyles(),
          className,
        )}
        dangerouslySetInnerHTML={{ __html: currentHTML }}
      />

      {isFocused && editable && (
        <SafePortal>
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 rounded-lg border border-stone-200 bg-white p-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                Stil Düzenleme
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1">
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs text-stone-700 shadow-sm">
                    Enter
                  </kbd>
                </div>
                <span className="text-xs text-stone-600">Kaydet</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1">
                  <Command size={12} className="text-stone-600" />
                  <span className="text-xs font-medium text-stone-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
                    B
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600">Kalın</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1">
                  <Command size={12} className="text-stone-600" />
                  <span className="text-xs font-medium text-stone-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
                    I
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600">Italic</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1">
                  <Command size={12} className="text-stone-600" />
                  <span className="text-xs font-medium text-stone-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
                    U
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600">Alt Çizgi</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1">
                  <Command size={12} className="text-stone-600" />
                  <span className="text-xs font-medium text-stone-600">+ Shift +</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
                    P
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-600">Renk</span>
                </div>
              </div>
            </div>

            <div className="mt-1 border-t border-stone-100 pt-2">
              <p className="text-[10px] text-stone-400">Stil uygulamak için metin seçin</p>
            </div>
          </div>
        </SafePortal>
      )}
    </>
  )
}

export const EditableText = ({ ...props }: EditableTextProps) => {
  return (
    <ClientOnly fallback={<span className="inline-flex h-3.5 w-34 animate-pulse bg-stone-200" />}>
      <InnerComponent {...props} />
    </ClientOnly>
  )
}
