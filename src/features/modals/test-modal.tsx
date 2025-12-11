import { X } from 'lucide-react'
import { useGlobalModalStore } from './store'

interface TestModalProps {
  onClose: () => void
}

export function TestModal({ onClose }: TestModalProps) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:max-w-lg md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Title</h2>
          <p className="mt-0.5 text-xs text-gray-500">Description</p>
        </div>
        <button
          onClick={onClose}
          className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50"
        >
          <X className="size-4 text-gray-500 transition-colors group-hover:text-red-600" />
        </button>
      </div>
    </div>
  )
}

export const useTestModal = () => {
  const { open } = useGlobalModalStore()

  const openTestModal = () => {
    open(TestModal as any, {})
  }

  return { openTestModal }
}
