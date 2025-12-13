import { Eye, EyeOff } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useDocumentStore } from '@/features/documents/store'
import { useSearch } from '@tanstack/react-router'

interface HideableTextProps {
  children: React.ReactNode
  className?: string
  editKey: string
}

export const HideableText = ({ children, className, editKey }: HideableTextProps) => {
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
            'absolute top-0 -left-8 z-10 flex size-4 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900',
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
