import { Eye, EyeOff } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useDocumentStore } from '@/features/documents/store'
import { ClientOnly, useSearch } from '@tanstack/react-router'

export interface EditableHideProps {
  children: React.ReactNode
  className?: string
  editKey: string
}

const InnerComponent = ({ children, className, editKey }: EditableHideProps) => {
  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'
  const { edits, setEdit } = useDocumentStore()

  const savedValue = edits[editKey] as boolean | undefined

  // Default olarak görünür, kullanıcı gizlemişse gizli
  const isHidden = savedValue ?? false

  const toggleVisibility = () => {
    setEdit(editKey, !isHidden)
  }

  // Edit modu kapalıysa ve hidden ise render etme
  if (!editable && isHidden) {
    return null
  }

  return (
    <div className="relative inline-block">
      {editable && (
        <button
          onClick={toggleVisibility}
          className={twMerge(
            'absolute top-0 -left-8 z-10 flex size-4 items-center justify-center rounded-md border border-stone-300 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-900',
          )}
        >
          {isHidden ? <EyeOff size={10} /> : <Eye size={10} />}
        </button>
      )}

      <div
        className={twMerge(
          'transition-opacity',
          editable && isHidden && 'line-through decoration-red-500 decoration-2 opacity-30',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const EditableHide = ({ ...props }: EditableHideProps) => {
  return (
    <ClientOnly fallback={<span className="inline-flex h-2.5 w-30 animate-pulse bg-stone-200" />}>
      <InnerComponent {...props} />
    </ClientOnly>
  )
}
