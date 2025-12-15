import { useState, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDocumentStore } from '@/features/documents/store'
import { ClientOnly, useSearch } from '@tanstack/react-router'
import { SafePortal } from '@/components/safe-portal'

export interface EditableLinkProps {
  defaultValue: LinkData
  seedValue?: LinkData | null
  className?: string
  editKey: string
}

const buildHref = (type: LinkData['type'], value: string): string => {
  if (!value) return '#'
  if (type === 'mailto') return `mailto:${value}`
  if (type === 'tel') return `tel:${value}`
  return value.startsWith('http') ? value : `https://${value}`
}

export const InnerComponent = ({
  defaultValue,
  seedValue,
  className,
  editKey,
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

  // Priority: savedData > seedValue > defaultValue
  const currentData: LinkData = savedData ?? seedValue ?? defaultValue

  const hasUserEdit = savedData !== undefined && savedData.value.length > 0
  const hasSeedData = seedValue !== null && seedValue !== undefined && seedValue.value.length > 0
  const isEditedOrSeeded = hasUserEdit || hasSeedData

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

    if (isEditedOrSeeded) {
      return 'border border-dashed border-neutral-300 bg-neutral-200 px-2 py-0'
    }

    return 'border border-dashed border-orange-400 bg-orange-100 px-2 py-0 min-w-10'
  }

  // İlk render'da seedValue varsa ve henüz user edit yoksa, seed'i store'a kaydet
  useEffect(() => {
    if (seedValue && savedData === undefined) {
      setEdit(editKey, seedValue)
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
            className="absolute z-50 w-64 rounded-md border border-stone-200 bg-white p-4 shadow-lg"
            style={{ top: modalPosition.top, left: modalPosition.left }}
          >
            <h4 className="mb-3 text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Edit Link
            </h4>

            <div className="mb-3 flex overflow-hidden rounded-md border border-stone-200">
              {(['https', 'mailto', 'tel'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className={twMerge(
                    'flex-1 px-2 py-1.5 text-[10px] font-medium uppercase transition-colors',
                    formType === type
                      ? 'bg-black text-white'
                      : 'bg-stone-50 text-neutral-600 hover:bg-neutral-100',
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
              className="mb-3 w-full rounded-md border border-stone-300 px-3 py-2 text-xs outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                className="flex-1 rounded-md bg-black py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md border border-stone-200 bg-white py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
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

export const EditableLink = ({ ...props }: EditableLinkProps) => {
  return (
    <ClientOnly fallback={<span className="inline-flex h-2.5 w-30 animate-pulse bg-stone-200" />}>
      <InnerComponent {...props} />
    </ClientOnly>
  )
}
