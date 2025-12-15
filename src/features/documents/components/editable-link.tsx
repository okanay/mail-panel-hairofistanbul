import { useState, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDocumentStore } from '@/features/documents/store'
import { useSearch } from '@tanstack/react-router'
import { SafePortal } from '@/components/safe-portal'

export interface EditableLinkProps {
  href: string
  seedValue?: string | null | undefined
  className?: string
  editKey: string
  linkType?: LinkData['type']
}

export const EditableLink = ({
  href,
  seedValue,
  className,
  editKey,
  linkType,
}: EditableLinkProps) => {
  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'
  const { edits, setEdit } = useDocumentStore()

  const savedData = edits[editKey] as LinkData | undefined
  const linkRef = useRef<HTMLAnchorElement>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [formValue, setFormValue] = useState('')
  const [formType, setFormType] = useState<LinkData['type']>('https')

  const isSeedMode = seedValue && seedValue !== href

  const initialHref = seedValue || href
  const initialType = linkType || detectType(initialHref)
  const initialValue =
    isSeedMode && seedValue
      ? seedValue // seedValue zaten temiz
      : cleanValue(initialHref, initialType)

  const currentData: LinkData = savedData ?? {
    type: initialType,
    value: initialValue,
  }

  const hasUserEdit = savedData !== undefined && savedData.value.length > 0
  const hasSeedContent = isSeedMode && currentData.value.length > 0
  const isEditedAndFilled = hasUserEdit || hasSeedContent
  const finalHref = buildHref(currentData.type, currentData.value)

  const handleLinkClick = (e: React.MouseEvent) => {
    if (!editable) return
    e.preventDefault()

    setFormValue(currentData.value)
    setFormType(currentData.type)

    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      setModalPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      })
    }

    setIsModalOpen(true)
  }

  const handleSave = () => {
    setEdit(editKey, { value: formValue, type: formType })
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const getStatusStyles = () => {
    if (!editable) return ''

    if (isModalOpen) {
      return 'border border-black border-dashed bg-black/70 text-white px-2 py-1 outline-none min-w-10 z-20 relative'
    }

    if (isEditedAndFilled) {
      return 'border border-dashed border-gray-400 bg-gray-300 px-2 py-0'
    }

    return 'border border-dashed border-orange-400 bg-orange-100 px-2 py-0 min-w-10'
  }

  useEffect(() => {
    if (isSeedMode && savedData === undefined && seedValue) {
      const seedType = detectType(seedValue, href)
      setEdit(editKey, { value: seedValue, type: seedType })
    }
  }, [])

  useEffect(() => {
    if (!isModalOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-modal="editable-link"]') || linkRef.current?.contains(target)) {
        return
      }
      setIsModalOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isModalOpen])

  return (
    <>
      <a
        ref={linkRef}
        href={finalHref}
        onClick={handleLinkClick}
        className={twMerge(
          'isolate caret-black transition-[padding] duration-250 ease-in-out focus:ring-0',
          editable && 'cursor-pointer',
          getStatusStyles(),
          className,
        )}
      >
        {currentData.value || <span className="italic opacity-50">Empty Link</span>}
      </a>

      {isModalOpen && (
        <SafePortal>
          <div
            data-modal="editable-link"
            className="absolute z-50 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-lg"
            style={{ top: modalPosition.top, left: modalPosition.left }}
          >
            <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Edit Link
            </h4>

            <div className="mb-3 flex overflow-hidden rounded-md border border-gray-200">
              {(['https', 'mailto', 'tel'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className={twMerge(
                    'flex-1 px-2 py-1.5 text-[10px] font-medium uppercase transition-colors',
                    formType === type
                      ? 'bg-black text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                  )}
                >
                  {type === 'https' ? 'Web' : type === 'mailto' ? 'Mail' : 'Tel'}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder={
                formType === 'mailto'
                  ? 'email@example.com'
                  : formType === 'tel'
                    ? '+90 555 ...'
                    : 'example.com'
              }
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 rounded-md bg-black py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md border border-gray-200 bg-white py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
          ,
        </SafePortal>
      )}
    </>
  )
}

const detectType = (href: string, fallbackHref?: string): LinkData['type'] => {
  // İlk href'i kontrol et
  if (href.startsWith('mailto:')) return 'mailto'
  if (href.startsWith('tel:')) return 'tel'
  if (href.startsWith('http')) return 'https'

  // Eğer prefix yoksa ve fallback varsa, ondan çıkar
  if (fallbackHref) {
    if (fallbackHref.startsWith('mailto:')) return 'mailto'
    if (fallbackHref.startsWith('tel:')) return 'tel'
  }

  return 'https'
}

const cleanValue = (href: string, type: LinkData['type']): string => {
  if (type === 'mailto') return href.replace('mailto:', '')
  if (type === 'tel') return href.replace('tel:', '')
  return href.replace(/^https?:\/\//, '')
}

const buildHref = (type: LinkData['type'], value: string): string => {
  if (!value) return '#'
  if (type === 'mailto') return `mailto:${value}`
  if (type === 'tel') return `tel:${value}`
  return value.startsWith('http') ? value : `https://${value}`
}
