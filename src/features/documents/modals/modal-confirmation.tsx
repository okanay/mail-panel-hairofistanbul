import { useModalStore } from '@/features/modals/store'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

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
    },
    warning: {
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      button: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600',
    },
    info: {
      icon: 'text-blue-600',
      iconBg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
    },
  }

  const styles = variantStyles[variant]

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
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
          >
            <AlertTriangle className={`size-5 ${styles.icon}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-950">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          disabled={modalPending}
          className="group flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-gray-100 disabled:opacity-50"
        >
          <X className="size-4 text-gray-500" />
        </button>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 gap-3 bg-gray-50 px-6 py-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={modalPending}
          className="flex h-11 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={modalPending}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold text-white transition-all disabled:opacity-50 ${styles.button}`}
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
