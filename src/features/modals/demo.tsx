import { X } from 'lucide-react'
import { useGlobalModalStore } from './store'
import DropdownDemo from '../dropdowns/demo'

interface Props {
  onClose: () => void
}

export function ModalDemo({ onClose }: Props) {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-lg md:rounded-lg md:shadow-2xl">
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

      <DropdownDemo />
    </div>
  )
}

export const useDemoModal = () => {
  const { open } = useGlobalModalStore()

  const openDemoModal = (_: Omit<Props, 'onClose'>) => {
    open(ModalDemo as any, {})
  }

  return { openDemoModal }
}

export const DemoDropdownAndModalFeature = () => {
  const { openDemoModal } = useDemoModal()

  return (
    <button type="button" onClick={openDemoModal}>
      Open Demo Modal
    </button>
  )
}
