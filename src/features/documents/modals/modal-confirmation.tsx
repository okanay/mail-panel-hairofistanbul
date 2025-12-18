import { useModalStore } from '@/features/modals/store'
import { X, Loader2, Info, TriangleAlert, FileWarning } from 'lucide-react'

interface ConfirmationModalProps {
  onClose: () => void
  title: string
  description: string
  onSubmit: () => Promise<void> | void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
  onClose,
  title,
  description,
  onSubmit,
  onCancel,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'danger',
}: ConfirmationModalProps) {
  const { setModalPending, modalPending } = useModalStore()

  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      iconBg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700 border-red-600',
      iconComponent: TriangleAlert,
    },
    warning: {
      icon: 'text-orange-600',
      iconBg: 'bg-orange-50',
      button: 'bg-orange-600 hover:bg-orange-700 border-orange-600',
      iconComponent: FileWarning,
    },
    info: {
      icon: 'text-blue-600',
      iconBg: 'bg-blue-50',
      button: 'bg-teal-600 hover:bg-teal-700 border-teal-600',
      iconComponent: Info,
    },
  }

  const styles = variantStyles[variant]
  const Icon = styles.iconComponent

  const handleSubmit = async () => {
    setModalPending(true)
    try {
      await onSubmit()
      onClose()
    } catch (error) {
      console.error('Confirmation action failed:', error)
    } finally {
      setModalPending(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:w-md md:max-w-md md:rounded-lg md:shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-100 px-6 py-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
          >
            <Icon className={`size-5 ${styles.icon}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-950">{title}</h2>
            <p className="mt-1 text-sm text-stone-600">{description}</p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          disabled={modalPending}
          className="group flex size-8 items-center justify-center rounded-full border border-stone-100 bg-stone-50 transition-[colors_opacity] duration-180 hover:border-stone-200 hover:bg-stone-100 disabled:cursor-not-allowed"
        >
          <X className="size-4 text-stone-500 transition-[colors_opacity] duration-180" />
        </button>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 gap-3 bg-stone-50 px-6 py-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={modalPending}
          className="flex h-11 flex-1 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition-[colors_opacity] duration-180 hover:bg-stone-50 disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={modalPending}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold text-white transition-[colors_opacity] duration-180 disabled:opacity-50 ${styles.button}`}
        >
          {modalPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  )
}

// ============================================
// 2. CONFIRMATION MODAL HOOK
// ============================================
interface UseConfirmationModalOptions {
  title: string
  description: string
  onSubmit: () => Promise<void> | void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const useConfirmationModal = () => {
  const { open } = useModalStore()

  const openConfirmationModal = (options: UseConfirmationModalOptions) => {
    open(ConfirmationModal as any, { ...options })
  }

  return { openConfirmationModal }
}
