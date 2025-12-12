import { useDocumentStore } from '@/features/documents/store'
import { useSearch } from '@tanstack/react-router'
import DOMPurify from 'dompurify'
import { Command } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

interface EditableTextProps {
  children: string
  seedText?: string | null | undefined
  className?: string
  focusClassName?: string
  editKey: string
}

export const EditableText = ({
  children,
  seedText,
  className,
  focusClassName,
  editKey,
}: EditableTextProps) => {
  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'
  const { edits, setEdit } = useDocumentStore()
  const savedValue = edits[editKey] as string | undefined
  const contentRef = useRef<HTMLSpanElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isUpdatingRef = useRef(false)

  const isSeedMode = seedText && seedText !== children
  const initialHTML = seedText || children
  const currentHTML = savedValue !== undefined ? savedValue : initialHTML

  const sanitizeHTML = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'span', 'b', 'i', 'mark', 'sub', 'sup', 's', 'del'],
      ALLOWED_ATTR: ['class', 'data-style'],
      KEEP_CONTENT: true,
    })
  }

  const getTextContent = (html: string): string => {
    const temp = document.createElement('div')
    temp.innerHTML = sanitizeHTML(html)
    return temp.textContent?.trim() || ''
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (!contentRef.current) return

    isUpdatingRef.current = true

    const rawHTML = contentRef.current.innerHTML.trim()
    const cleanHTML = sanitizeHTML(rawHTML)
    const textContent = contentRef.current.textContent?.trim() || ''

    if (cleanHTML !== currentHTML) {
      setEdit(editKey, cleanHTML)
    }

    if (!textContent && contentRef.current.innerHTML !== '') {
      contentRef.current.innerHTML = ''
      setEdit(editKey, '')
    }

    setTimeout(() => {
      isUpdatingRef.current = false
    }, 0)
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
      const fragment = document.createDocumentFragment()

      while (existingSpan.firstChild) {
        fragment.appendChild(existingSpan.firstChild)
      }

      parent?.replaceChild(fragment, existingSpan)
    } else {
      const span = document.createElement('span')
      span.className = className
      span.setAttribute('data-style', styleName)

      try {
        range.surroundContents(span)
      } catch {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    }

    selection.removeAllRanges()

    if (contentRef.current) {
      const cleanHTML = sanitizeHTML(contentRef.current.innerHTML)
      setEdit(editKey, cleanHTML)
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
      return 'border border-dashed border-gray-400 bg-gray-300 px-2 py-0'
    }

    return 'border border-dashed border-amber-400 bg-amber-100 px-2 py-0 min-w-10'
  }

  useEffect(() => {
    if (!contentRef.current || isFocused || isUpdatingRef.current) return

    if (contentRef.current.innerHTML !== currentHTML) {
      const cleanHTML = sanitizeHTML(currentHTML)
      contentRef.current.innerHTML = cleanHTML
    }
  }, [currentHTML, isFocused])

  useEffect(() => {
    if (isSeedMode && savedValue === undefined && seedText) {
      const cleanHTML = sanitizeHTML(seedText)
      setEdit(editKey, cleanHTML)
    }
  }, [isSeedMode, savedValue, seedText, editKey, setEdit])

  useEffect(() => {
    if (!contentRef.current || !editable) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey
      const key = e.key.toLowerCase()

      // Enter tuşu - shift ile br, normal ile save
      if (key === 'enter') {
        e.preventDefault()
        if (e.shiftKey) {
        } else {
          saveAndBlur()
        }
        return
      }

      // Modifier tuşu yoksa style işlemleri yapma
      if (!isModifier) return

      // Style toggle işlemleri
      let shouldPrevent = false

      if (key === 'b' && !e.shiftKey) {
        shouldPrevent = true
        toggleStyle('font-bold', 'apply-bold')
      } else if (key === 'i' && !e.shiftKey) {
        shouldPrevent = true
        toggleStyle('italic', 'apply-italic')
      } else if (key === 'u' && !e.shiftKey) {
        shouldPrevent = true
        toggleStyle('underline', 'apply-underline')
      } else if (key === 'p' && e.shiftKey) {
        shouldPrevent = true
        toggleStyle('text-primary decoration-primary', 'apply-color')
      }

      if (shouldPrevent) {
        e.preventDefault()
      }
    }

    const element = contentRef.current
    element.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [editable, toggleStyle])

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
          'isolate caret-black transition-[padding] duration-250 ease-in-out',
          editable && 'cursor-pointer',
          getStatusStyles(),
          className,
        )}
      />

      {isFocused &&
        editable &&
        createPortal(
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Stil Düzenleme
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs text-gray-700 shadow-sm">
                    Enter
                  </kbd>
                </div>
                <span className="text-xs text-gray-600">Kaydet</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
                  <Command size={12} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                    B
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-600">Kalın</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
                  <Command size={12} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                    I
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-600">Italic</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
                  <Command size={12} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">+</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                    U
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-600">Alt Çizgi</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
                  <Command size={12} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">+ Shift +</span>
                  <kbd className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
                    P
                  </kbd>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-600">Renk</span>
                </div>
              </div>
            </div>

            <div className="mt-1 border-t border-gray-100 pt-2">
              <p className="text-[10px] text-gray-400">Stil uygulamak için metin seçin</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
